// Mock PrismaClient to ensure compilation works flawlessly on local environments
// without requiring active database connections or prisma client generation.
export class PrismaClient {
  constructor() {}
  
  // Mock methods for future database expansion
  user = {
    findUnique: async () => null,
    create: async () => null,
    update: async () => null,
  };
  product = {
    findMany: async () => [],
    findUnique: async () => null,
  };
}

export const prisma = new PrismaClient();
export default prisma;
