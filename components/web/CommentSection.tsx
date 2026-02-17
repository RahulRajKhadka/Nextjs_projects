"use client";

import { MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentSchema } from "@/app/Schemas/Comment";
import { Textarea } from "../ui/textarea";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Button } from "../ui/button";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { Toaster } from "../ui/sonner";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { z } from "zod";
import { useTransition } from "react";


type CommentFormData = z.infer<typeof commentSchema>;





export function CommentSection() {
      const params = useParams<{ postId: Id<"posts" >}>();

    const data=useQuery(api.comment.getCommentsByPostId,{postId:params.postId})

  const [isPending, startTransition] = useTransition();




  const createComment = useMutation(api.comment.createComment);

  const form = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      body: "",
    
      postId: params.postId as Id<"posts">,
    },
  });

  
  async function onSubmit(data: CommentFormData) {
    startTransition(async () => {
      try {
        await createComment(data);
        toast.success("Comment posted");
        form.reset();
      } catch {
        toast.error("Failed to create comment");
      }
    });
  }

  return (
    <>
     
      <Toaster />

      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <span className="font-semibold">Comments</span>
        </CardHeader>

        <CardContent>
          
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Controller
              control={form.control}
              name="body"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="body">Your comment</FieldLabel>
                  <Textarea
                    id="body"
                    placeholder="Write a comment..."
                    aria-describedby={
                      fieldState.error ? "body-error" : undefined
                    }
                    {...field}
                  />
                  {fieldState.error && (
                    <FieldError id="body-error">
                      {fieldState.error.message}
                    </FieldError>
                  )}
                </Field>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Posting..." : "Post comment"}
            </Button>
          </form>
          {JSON.stringify(data)}
        </CardContent>
      </Card>
    </>
  );
}