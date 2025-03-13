import { PrismaClient } from '@prisma/client';

export class DB {
  private static instance: DB;
  public prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient();
  }

  static getInstance(): DB {
    if (!DB.instance) {
      DB.instance = new DB();
    }
    return DB.instance;
  }
}
