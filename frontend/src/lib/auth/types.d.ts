import type { Role } from "./store";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSessionUser;
  }

  interface User {
    role: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
  }
}

type DefaultSessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};
