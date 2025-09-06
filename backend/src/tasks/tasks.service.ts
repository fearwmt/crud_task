import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class TasksService {
  async findAll() {
    return prisma.task.findMany();
  }

  async findOne(id: number) {
    return prisma.task.findUnique({ where: { id } });
  }

  async create(data: { title: string; completed?: boolean }) {
  const title = data?.title?.trim();
  if (!title) throw new Error('title is required');

  return prisma.task.create({
    data: {
      title,
      completed: data.completed ?? false, 
    },
  });
}

async update(id: number, data: { title?: string; completed?: boolean }) {
  return prisma.task.update({ where: { id }, data });
}


  async remove(id: number) {
    return prisma.task.delete({ where: { id } });
  }
}
