import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async create(dto: CreateCategoryDto) {
    const trimmed = dto.name.trim();
    const existing = await this.prisma.category.findUnique({
      where: { name: trimmed },
    });

    if (existing) {
      throw new ConflictException(`Kategori "${trimmed}" sudah ada.`);
    }

    return this.prisma.category.create({
      data: { name: trimmed },
    });
  }

  async remove(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Kategori dengan ID ${id} tidak ditemukan.`);
    }

    return this.prisma.category.delete({
      where: { id },
    });
  }
}
