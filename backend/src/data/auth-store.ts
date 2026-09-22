import { prisma } from "../prisma";
import type { User as PrismaUser, Role } from "@prisma/client";
import { isMailConfigured, sendMail } from "../mail";

export type { Role };

export type AuthUser = PrismaUser;

// In-memory fallbacks when cloud database is not connected
const fallbackOtps = new Map<string, { code: string; expiresAt: Date }>();
const fallbackUsers = new Map<string, AuthUser>([
  [
    "admin@example.com",
    {
      id: "user-admin-demo",
      email: "admin@example.com",
      name: "Jordan Admin",
      primaryRole: "ADMIN",
      status: "ACTIVE",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  [
    "assessor@example.com",
    {
      id: "user-assessor-demo",
      email: "assessor@example.com",
      name: "Sam Assessor",
      primaryRole: "ASSESSOR",
      status: "ACTIVE",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  [
    "applicant@example.com",
    {
      id: "user-applicant-demo",
      email: "applicant@example.com",
      name: "Alex Applicant",
      primaryRole: "APPLICANT",
      status: "ACTIVE",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
]);

function getOrCreateFallbackUser(email: string): AuthUser {
  const norm = normalizeEmail(email);
  const existing = fallbackUsers.get(norm);
  if (existing) return existing;

  const newUser: AuthUser = {
    id: `user-${Date.now()}`,
    email: norm,
    name: norm.split("@")[0] || "User",
    primaryRole: "APPLICANT",
    status: "ACTIVE",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  fallbackUsers.set(norm, newUser);
  return newUser;
}


export async function findUserByEmail(email: string): Promise<AuthUser | null> {
  try {
    return await prisma.user.findFirst({ where: { email: { equals: email, mode: "insensitive" } } });
  } catch (err) {
    console.warn("[auth-store] DB unreachable, using fallback user store for:", email);
    return getOrCreateFallbackUser(email);
  }
}

export async function findUserById(id: string): Promise<AuthUser | null> {
  try {
    return await prisma.user.findUnique({ where: { id } });
  } catch (err) {
    for (const u of fallbackUsers.values()) {
      if (u.id === id) return u;
    }
    return null;
  }
}

export async function getAllUsers(): Promise<AuthUser[]> {
  try {
    return await prisma.user.findMany({ orderBy: { createdAt: "asc" } });
  } catch (err) {
    return Array.from(fallbackUsers.values());
  }
}

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: string;
}

const SAFE_SELECT = { id: true, name: true, email: true, primaryRole: true, status: true } as const;

export async function getAllUsersSafe(): Promise<SafeUser[]> {
  try {
    const rows = await prisma.user.findMany({ orderBy: { createdAt: "asc" }, select: SAFE_SELECT });
    return rows.map((u) => ({ ...u, role: u.primaryRole }));
  } catch (err) {
    return Array.from(fallbackUsers.values()).map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.primaryRole,
      status: u.status,
    }));
  }
}

export async function getUsersByRoleSafe(role: Role): Promise<SafeUser[]> {
  try {
    const rows = await prisma.user.findMany({ where: { primaryRole: role }, select: SAFE_SELECT });
    return rows.map((u) => ({ ...u, role: u.primaryRole }));
  } catch (err) {
    return Array.from(fallbackUsers.values())
      .filter((u) => u.primaryRole === role)
      .map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.primaryRole,
        status: u.status,
      }));
  }
}


export async function getUserOrganisationName(userId: string): Promise<string> {
  try {
    const membership = await prisma.organisationMembership.findFirst({
      where: { userId },
      include: { organisation: true },
    });
    return membership?.organisation.displayName ?? "Northfield Testing Laboratories";
  } catch (err) {
    return "Northfield Testing Laboratories";
  }
}

export async function getUserOrganisationId(userId: string): Promise<string | null> {
  // No membership means "no organisation" (null) — callers already handle
  // that. Never invent an id: a fake one made getCabDetails crash with P2025,
  // and swallowing DB errors here hid real outages behind the same fake id.
  const membership = await prisma.organisationMembership.findFirst({ where: { userId } });
  return membership?.organisationId ?? null;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function createLoginOtp(email: string): Promise<string> {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const key = normalizeEmail(email);
  try {
    await prisma.loginOtp.upsert({
      where: { email: key },
      create: { email: key, code, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
      update: { code, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
    });
  } catch (err) {
    console.warn("[auth-store] DB unreachable, storing OTP in fallback memory map");
    fallbackOtps.set(key, { code, expiresAt: new Date(Date.now() + 10 * 60 * 1000) });
  }

  // With SMTP configured the code goes to the user's inbox only and is NOT
  // returned (empty string = "emailed"). Without SMTP it is returned for
  // local/demo use, as before — never do that in a real deployment.
  if (isMailConfigured()) {
    const mail = await sendMail({
      to: key,
      subject: "Your SAAF sign-in code",
      text: `Your one-time sign-in code is ${code}. It expires in 10 minutes. If you did not request it, ignore this email.`,
      html: `<p>Your one-time sign-in code is:</p><p style="font-size:24px;font-weight:bold;letter-spacing:4px">${code}</p><p>It expires in 10 minutes. If you did not request it, ignore this email.</p>`,
    });
    if (!mail.sent) throw new Error("Could not send the sign-in code email. Please try again.");
    return "";
  }
  return code;
}

export async function consumeLoginOtp(email: string, code: string): Promise<boolean> {
  const key = normalizeEmail(email);
  try {
    const entry = await prisma.loginOtp.findUnique({ where: { email: key } });
    if (entry) {
      if (entry.expiresAt < new Date()) {
        await prisma.loginOtp.delete({ where: { email: key } }).catch(() => {});
        return false;
      }
      if (entry.code !== code) return false;
      await prisma.loginOtp.delete({ where: { email: key } });
      return true;
    }
  } catch (err) {
    console.warn("[auth-store] DB unreachable, checking fallback memory map for OTP");
  }

  const fb = fallbackOtps.get(key);
  if (!fb) return false;
  if (fb.expiresAt < new Date()) {
    fallbackOtps.delete(key);
    return false;
  }
  if (fb.code !== code) return false;
  fallbackOtps.delete(key);
  return true;
}

