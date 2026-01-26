"use client";

import React from "react";
import Link from "next/link";
import { useConvexAuth } from "convex/react";
import { Button, buttonVariants } from "../ui/button";
import { ModeToggle } from "./theme.toggle";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Navbar = () => {

  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Logged out successfully");
          router.push("/");
        },
        onError: (err) => {
          toast.error(err?.error?.message || "Logout failed");
        },
      },
    });
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">

        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
            <span className="text-lg font-bold text-white">N</span>
          </div>
          <span className="text-xl font-bold">NextPro</span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center space-x-1">
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/blog" className="nav-link">Blog</Link>
          <Link href="/create" className="nav-link">Create</Link>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-2">
          <ModeToggle />

         
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
