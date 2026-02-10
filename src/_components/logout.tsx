"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  return (
    <Button onClick={() => signOut({ callbackUrl: "/" })}>
      Sair
      <LogOut />
    </Button>
  );
}
