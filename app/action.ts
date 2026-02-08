"use server";

import { z } from "zod";
import { postSchema } from "./Schemas/blog";
import { fetchAuthMutation, isAuthenticated } from "@/lib/auth-server";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { revalidatePath } from "next/cache";

export async function createBlogAction(values: z.infer<typeof postSchema>) {
  
  // Check authentication first
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return { error: "You must be logged in to create a post" };
  }

  const result = postSchema.safeParse(values);
  
  if (!result.success) {
    console.error("Validation failed:", result.error);
    return { error: "Invalid form data" };
  }

  try {
    let storageId: Id<"_storage"> | undefined;

    // Only upload image if provided
    if (result.data.image && result.data.image instanceof File) {
      console.log("Uploading image...");
      
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
        const errorText = await uploadResult.text();
        console.error("Upload failed:", errorText);
        return { error: "Failed to upload image" };
      }

      const uploadData = await uploadResult.json();
      storageId = uploadData.storageId as Id<"_storage">;
      console.log("Image uploaded successfully:", storageId);
    }

   
    await fetchAuthMutation(api.posts.createPost, {
      title: result.data.title,
      content: result.data.content,
      imageStorageId: storageId,
    });

 
  } catch (error) {
    console.error("Error creating post:", error);
    
    if (error instanceof Error) {
      if (error.message.includes("Unauthorized") || error.message.includes("not authenticated")) {
        return { error: "Please log in to create a post" };
      }
      return { error: error.message };
    }
    
    return { error: "Failed to create the post" };
  }

 revalidatePath("/blog")
  redirect("/blog");
}