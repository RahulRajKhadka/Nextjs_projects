"use client"

import { postSchema } from "@/app/Schemas/blog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod"
import { useMutation } from "convex/react"
import { useReducer, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createBlogAction } from "@/app/action";


export default function CreateRoute() {
  const [isPending, startTransition] = useTransition();
  const router =useRouter();
  const createPost = useMutation(api.posts.createPost);
 
  const form = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: "",
      title: "",
    },
  });

  function onSubmit(values: z.infer<typeof postSchema>) {
    startTransition(async () => {

     console.log("hey this runs on the client side");
     await createBlogAction(values);
    });
  }

  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Create Post
        </h1>
        <p className="text-xl text-muted-foreground pt-4">
          Share your thought with the big world
        </p>
      </div>

      <Card className="w-full max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Create Blog Article</CardTitle>
          <CardDescription>Create a new blog article</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-y-4">
              {/* Title Field */}
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="title">Title</FieldLabel>
                    <FieldGroup>
                      <Input
                        {...field}
                        id="title"
                        type="text"
                        placeholder="Super Cool title"
                        disabled={isPending}
                        aria-invalid={!!fieldState.error}
                        aria-describedby={fieldState.error ? "title-error" : undefined}
                      />
                    </FieldGroup>
                    {fieldState.error && (
                      <FieldError id="title-error">
                        {fieldState.error.message}
                      </FieldError>
                    )}
                  </Field>
                )}
              />

              {/* Content Field */}
              <Controller
                name="content"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="content">Content</FieldLabel>
                    <FieldGroup>
                      <Textarea
                        {...field}
                        id="content"
                        placeholder="Super Cool blog content"
                        disabled={isPending}
                        aria-invalid={!!fieldState.error}
                        aria-describedby={fieldState.error ? "content-error" : undefined}
                      />
                    </FieldGroup>
                    {fieldState.error && (
                      <FieldError id="content-error">
                        {fieldState.error.message}
                      </FieldError>
                    )}
                  </Field>
                )}
              />

              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create Post"}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}