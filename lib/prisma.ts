import { createRequire } from "module";
import type { PrismaClient as PrismaClientType } from "@prisma/client";

const requireModule = createRequire(import.meta.url);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientType | undefined;
};

function createPrismaInstance(): PrismaClientType {
  try {
    const { PrismaClient } = requireModule("@prisma/client") as {
      PrismaClient: new () => PrismaClientType;
    };
    return new PrismaClient();
  } catch {
    for (const key of Object.keys(requireModule.cache)) {
      if (key.includes("@prisma") || key.includes(".prisma")) {
        delete requireModule.cache[key];
      }
    }
    const { PrismaClient } = requireModule("@prisma/client") as {
      PrismaClient: new () => PrismaClientType;
    };
    return new PrismaClient();
  }
}

export function getPrisma(): PrismaClientType {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaInstance();
  }
  return globalForPrisma.prisma;
}

export const prisma = new Proxy({} as PrismaClientType, {
  get(_target, prop, receiver) {
    const client = getPrisma();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
