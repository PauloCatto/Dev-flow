import * as PrismaScope from "@prisma/client";
import type { PrismaClient as PrismaClientType } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientType | undefined;
};

function getPrismaClient(): PrismaClientType {
  if (!globalForPrisma.prisma) {
    const Constructor = (
      PrismaScope as unknown as { PrismaClient?: new () => PrismaClientType }
    ).PrismaClient;

    if (typeof Constructor !== "function") {
      throw new Error("PrismaClient constructor not available");
    }

    globalForPrisma.prisma = new Constructor();
  }

  return globalForPrisma.prisma;
}

export const prisma = new Proxy({} as PrismaClientType, {
  get(_target, prop, receiver) {
    const client = getPrismaClient();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
