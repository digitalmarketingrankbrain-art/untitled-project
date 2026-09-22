import { rpc } from "@/lib/rpc-client";

/**
 * Thin proxy over backend/src/data/program-fees.ts. Wrapped in try/catch to
 * safely return an empty fee object if the backend is not reachable during
 * Vercel build prerendering (same resilience the old direct-Prisma version
 * had for "database not reachable at build time" — now "backend not
 * reachable" covers that plus the backend simply not having started yet).
 */
export interface ProgramFee {
  amount: number;
  currency: string;
}

export async function getProgramFees(): Promise<Record<string, ProgramFee>> {
  try {
    return await rpc("program-fees", "getProgramFees", []);
  } catch (err) {
    console.warn("Backend unreachable during build or request fallback:", err);
    return {};
  }
}
