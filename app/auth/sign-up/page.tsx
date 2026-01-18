"use client";

import { signUpSchema } from "@/app/Schemas/auth";
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
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { z } from "zod";

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  function onSubmit(data: SignUpFormData) {
    startTransition(async () => {
      try {
        const result = await authClient.signUp.email({
          email: data.email,
          name: data.username,
          password: data.password,
        });

        if (result.error) {
          toast.error(result.error.message || "Sign up failed. Please try again.");
          return;
        }

        toast.success("Account created successfully!");
        router.push("/");
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        toast.error(errorMessage);
      }
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign up</CardTitle>
          <CardDescription>Create an account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="username">Full Name</FieldLabel>
                  <FieldGroup>
                    <Input
                      {...field}
                      id="username"
                      type="text"
                      placeholder="Rahul Raj Khadka"
                      autoComplete="name"
                      disabled={isPending}
                      aria-invalid={!!fieldState.error}
                      aria-describedby={fieldState.error ? "username-error" : undefined}
                    />
                  </FieldGroup>
                  {fieldState.error && (
                    <FieldError id="username-error">
                      {fieldState.error.message}
                    </FieldError>
                  )}
                </Field>
              )}
            />

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
                      placeholder="your@gmail.com"
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
                      placeholder="Create a strong password"
                      autoComplete="new-password"
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
              {isPending ? "Creating account..." : "Sign up"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}