import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { findUserByEmail, consumeLoginOtp, type Role } from "@/lib/auth/store";
import { checkRateLimit } from "@/lib/rate-limit";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "rTb3L2W+7mpXdaykzr5XautQBPZaftiYmzdM9ps6UuA=",
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        email: {},
        otp: {},
      },
      async authorize(credentials, request) {
        const email = credentials?.email as string | undefined;
        const otp = credentials?.otp as string | undefined;
        if (!email || !otp) return null;

        // The real trust boundary for login — rate-limited independently of
        // the client-side pre-check (src/lib/auth/actions.ts:checkOtpAndSignIn
        // equivalent), since this endpoint can be called directly, bypassing
        // that pre-check.
        const forwardedFor = request.headers.get("x-forwarded-for");
        const ip = forwardedFor ? forwardedFor.split(",")[0]!.trim() : "unknown";
        const limit = checkRateLimit(`login-authorize:${ip}:${email.toLowerCase()}`, 10, 15 * 60 * 1000);
        if (!limit.allowed) return null;

        const user = await findUserByEmail(email);
        if (!user || user.status !== "ACTIVE") return null;
        if (!(await consumeLoginOtp(email, otp))) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.primaryRole,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: Role }).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
      }
      return session;
    },
  },
});
