"use client";

import { loginSchema } from "@/app/Schemas/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useTransition } from "react";

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: LoginFormData) {
    startTransition(async () => {
      try {
        await authClient.signIn.email(
          {
            email: data.email,
            password: data.password,
          },
          {
            fetchOptions: {
              onSuccess: () => {
                toast.success("Logged in successfully");
                router.push("/");
              },
              onError: (error) => {
                const errorMessage = error?.error?.message || "Login failed. Please try again.";
                toast.error(errorMessage);
              },
            },
          }
        );
      } catch (error) {
        toast.error("An unexpected error occurred");
      }
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <FieldGroup>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      autoComplete="email"
                      disabled={isPending}
                      aria-invalid={!!fieldState.error}
                      aria-describedby={fieldState.error ? "email-error" : undefined}
                    />
                  </FieldGroup>
                  {fieldState.error && (
                    <FieldError id="email-error">
                      {fieldState.error.message}
                    </FieldError>
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <FieldGroup>
                    <Input
                      {...field}
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      disabled={isPending}
                      aria-invalid={!!fieldState.error}
                      aria-describedby={fieldState.error ? "password-error" : undefined}
                    />
                  </FieldGroup>
                  {fieldState.error && (
                    <FieldError id="password-error">
                      {fieldState.error.message}
                    </FieldError>
                  )}
                </Field>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isPending}
            >
              {isPending ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}