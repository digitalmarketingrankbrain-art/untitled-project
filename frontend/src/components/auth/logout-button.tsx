"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

function LogoutButton() {
  return (
    <Button variant="secondary" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
      <LogOut className="size-4" strokeWidth={1.75} />
      Log out
    </Button>
  );
}

export { LogoutButton };
