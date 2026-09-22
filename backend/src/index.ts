import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { dispatch, RpcError } from "./rpc";

const app = express();

const rawCorsOrigin = process.env.CORS_ORIGIN || process.env.FRONTEND_URL || "*";
const allowedOrigins = rawCorsOrigin.split(",").map((s) => s.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server RPC (no origin header) or matched origins / wildcard
      if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
// Document uploads are sent as base64 inside the JSON body (see
// frontend's rpc-client.ts), so the default ~100kb body limit has to grow
// to comfortably clear the app's 25MB upload cap plus base64's ~33% overhead.
app.use(express.json({ limit: "40mb" }));

app.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true });
});

/**
 * Single internal RPC endpoint standing in for a full REST API surface —
 * this backend is the only thing allowed to hold DATABASE_URL now, and the
 * Next.js frontend calls into ~115 existing data-layer functions (moved
 * here verbatim from frontend/src/lib) through this one dispatcher rather
 * than a hand-written route per function. Never exposed to browsers:
 * gated by a shared secret only the frontend's own server process holds.
 */
app.post("/rpc", async (req: Request, res: Response) => {
  const key = req.headers["x-internal-key"];
  if (!process.env.INTERNAL_API_KEY || key !== process.env.INTERNAL_API_KEY) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }

  const { module, fn, args } = req.body ?? {};
  if (typeof module !== "string" || typeof fn !== "string") {
    return res.status(400).json({ ok: false, error: "Request must include { module, fn, args }." });
  }

  try {
    const result = await dispatch(module, fn, Array.isArray(args) ? args : []);
    res.json({ ok: true, result });
  } catch (err) {
    const status = err instanceof RpcError ? err.status : 500;
    console.error(`[rpc] ${module}.${fn} failed:`, err);
    res.status(status).json({
      ok: false,
      code: err instanceof RpcError ? err.code : undefined,
      error: err instanceof Error ? err.message : "Internal error",
    });
  }
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 4001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`backend listening on 0.0.0.0:${PORT}`);
});

