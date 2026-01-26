import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";

export const createPost = mutation({
  args: {
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    
    if (!user) {
      throw new Error("Unauthorized - you must be logged in to create a post");
    }

    const postId = await ctx.db.insert("posts", {
      title: args.title,
      body: args.content,
      authorId: user._id,
    });

    return postId;
  },
});