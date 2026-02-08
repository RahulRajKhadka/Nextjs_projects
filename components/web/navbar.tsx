"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useConvexAuth } from "convex/react";
import { Button, buttonVariants } from "../ui/button";
import { ModeToggle } from "./theme.toggle";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";
import { Home, PenSquare, BookOpen } from "lucide-react";

const Navbar = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();
  const pathname = usePathname();

  // ✅ Prevent hydration errors
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Logout handler
  const handleLogout = async () => {
    try {
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
    } catch (error) {
      toast.error("Something went wrong during logout");
    }
  };

  // Navigation links with icons
  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Blog", href: "/blog", icon: BookOpen },
    { name: "Create", href: "/create", icon: PenSquare },
  ];

  if (!mounted) return null;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6 lg:px-8">
        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center space-x-3 transition-transform hover:scale-105"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/20">
            <span className="text-lg font-bold text-white">N</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            NextPro
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`
                  group relative flex items-center gap-2 px-4 py-2 rounded-lg
                  text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }
                `}
              >
                <Icon className={`h-4 w-4 transition-transform group-hover:scale-110 ${isActive ? "text-primary" : ""}`} />
                <span>{link.name}</span>
                
                {/* Active indicator */}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-1/2 -translate-x-1/2 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ModeToggle />
          
          {!isLoading && (
            isAuthenticated ? (
              <Button 
                size="sm" 
                onClick={handleLogout}
                variant="outline"
                className="ml-2 hover:bg-destructive hover:text-destructive-foreground transition-colors"
              >
                Logout
              </Button>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Link
                  href="/auth/sign-up"
                  className={buttonVariants({ 
                    variant: "ghost", 
                    size: "sm",
                    className: "hidden sm:inline-flex"
                  })}
                >
                  Sign Up
                </Link>
                <Link
                  href="/auth/login"
                  className={buttonVariants({ 
                    variant: "default", 
                    size: "sm",
                    className: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md"
                  })}
                >
                  Login
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;