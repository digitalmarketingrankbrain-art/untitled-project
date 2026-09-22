import { prisma } from "../prisma";

export interface ProgramFee {
  amount: number;
  currency: string;
}

/**
 * Real fee data from the Prisma `Program` table.
 * Wrapped in try/catch to safely return an empty fee object if the database
 * is not reachable during Vercel build prerendering.
 */
export async function getProgramFees(): Promise<Record<string, ProgramFee>> {
  try {
    const rows = await prisma.program.findMany({ select: { slug: true, feeAmount: true, currency: true } });
    return Object.fromEntries(rows.map((r) => [r.slug, { amount: Number(r.feeAmount), currency: r.currency }]));
  } catch (err) {
    console.warn("Database unreachable during build or request fallback:", err);
    return {};
  }
}
