"use server";

import { z } from "zod";
import { postSchema } from "./Schemas/blog";
import { fetchAuthMutation } from "@/lib/auth-server";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";

export async function createBlogAction(values: z.infer<typeof postSchema>) {
  
  const result = postSchema.safeParse(values);
  
  if (!result.success) {
    return { error: "Invalid form data" };
  }

  try {
    let storageId: Id<"_storage"> | undefined;

    // Only upload image if provided
    if (result.data.image && result.data.image instanceof File) {
      const imageUrl = await fetchAuthMutation(
        api.posts.generateImageUploadUrl,
        {}
      );

      const uploadResult = await fetch(imageUrl, {
        method: "POST",
        headers: {
          "Content-Type": result.data.image.type,
        },
        body: result.data.image,
      });

      if (!uploadResult.ok) {
        return { error: "Failed to upload image" };
      }

      const uploadData = await uploadResult.json();
      storageId = uploadData.storageId as Id<"_storage">;
    }

    // Create post with or without image
    await fetchAuthMutation(api.posts.createPost, {
      title: result.data.title,
      content: result.data.content,
      imageStorageId: storageId,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    return { error: "Failed to create the post" };
  }

  redirect("/");
}