"use server";
import { z } from "zod";
import { postSchema } from "./Schemas/blog";
import { fetchAuthMutation } from "@/lib/auth-server";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";
import { getToken } from "@/lib/auth-server";

export async function createBlogAction(values: z.infer<typeof postSchema>) {
  const result = postSchema.safeParse(values);
  
  if (!result.success) {
    throw new Error("Invalid form data");
  }

  const token = await getToken();
  
  await fetchAuthMutation(
    api.posts.createPost, 
    {
      title: result.data.title, 
      content: result.data.content,
     
    }
  );

  return redirect("/");
}