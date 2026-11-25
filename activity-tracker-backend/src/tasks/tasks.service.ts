import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description ?? null,
        category: dto.category ?? 'Internal',
        completed: dto.completed ?? false,
        starred: dto.starred ?? false,
        subtasks: dto.subtasks?.length
          ? {
              create: dto.subtasks.map((st: { text: string; completed?: boolean }) => ({
                text: st.text,
                completed: st.completed ?? false,
              })),
            }
          : undefined,
      },
      include: { subtasks: true },
    });
  }

  async findAll(status?: string) {
    const whereClause: { completed?: boolean } = {};
    if (status === 'completed') {
      whereClause.completed = true;
    } else if (status === 'in-progress') {
      whereClause.completed = false;
    }

    return this.prisma.task.findMany({
      where: whereClause,
      include: { subtasks: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: { subtasks: true },
    });

    if (!task) {
      throw new NotFoundException(`Tugas dengan ID ${id} tidak ditemukan.`);
    }

    return task;
  }

  async update(id: number, dto: UpdateTaskDto) {
    await this.findOne(id);

    return this.prisma.$transaction(async (tx) => {
      if (dto.subtasks !== undefined) {
        await tx.subtask.deleteMany({
          where: { taskId: id },
        });

        if (dto.subtasks.length > 0) {
          await tx.subtask.createMany({
            data: dto.subtasks.map((st) => ({
              taskId: id,
              text: st.text,
              completed: Boolean(st.completed),
            })),
          });
        }
      }

      return tx.task.update({
        where: { id },
        data: {
          ...(dto.title !== undefined && { title: dto.title }),
          ...(dto.description !== undefined && { description: dto.description }),
          ...(dto.category !== undefined && { category: dto.category }),
          ...(dto.completed !== undefined && { completed: dto.completed }),
          ...(dto.starred !== undefined && { starred: dto.starred }),
        },
        include: { subtasks: true },
      });
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.task.delete({
      where: { id },
    });
  }

  async getStats() {
    const [total, completed, inProgress, starred] = await Promise.all([
      this.prisma.task.count(),
      this.prisma.task.count({ where: { completed: true } }),
      this.prisma.task.count({ where: { completed: false } }),
      this.prisma.task.count({ where: { starred: true } }),
    ]);

    return { total, completed, inProgress, starred };
  }
}
