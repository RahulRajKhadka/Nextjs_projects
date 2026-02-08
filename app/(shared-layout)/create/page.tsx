"use client"

import { postSchema } from "@/app/Schemas/blog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod"
import { useTransition } from "react";
import { createBlogAction } from "@/app/action";

export default function CreateRoute() {
  const [isPending, startTransition] = useTransition();
 
  const form = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: "",
      title: "",
      image: undefined
    },
  });

  function onSubmit(values: z.infer<typeof postSchema>) {
    startTransition(async () => {
      console.log("Submitting values:", values);
      
      const result = await createBlogAction(values);
      
      if (result?.error) {
        console.error("Error:", result.error);
        // You can show a toast here
        // toast.error(result.error);
      } else {
        console.log("Post created successfully!");
        // toast.success("Post created successfully!");
      }
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

              {/* Image Field */}
              <Controller
                name="image"
                control={form.control}
                render={({ field: { value, onChange, ...field }, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="image">Image (Optional)</FieldLabel>
                    <FieldGroup>
                      <Input
                        {...field}
                        id="image"
                        placeholder="Upload your image here"
                        disabled={isPending}
                        aria-invalid={!!fieldState.error}
                        aria-describedby={fieldState.error ? "image-error" : undefined}
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          onChange(file);
                        }}
                      />
                    </FieldGroup>
                    {fieldState.error && (
                      <FieldError id="image-error">
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