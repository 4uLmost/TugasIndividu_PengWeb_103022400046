import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module.js';
import { TasksModule } from './tasks/tasks.module.js';
import { CategoriesModule } from './categories/categories.module.js';

@Module({
  imports: [PrismaModule, TasksModule, CategoriesModule],
})
export class AppModule {}

