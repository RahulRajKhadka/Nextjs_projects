import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";


// This all are the server fucntion there 

export const createPost = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
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
      imageStorageId: args.imageStorageId ?? undefined,
    });
    
    return postId;
  },
});



export const getPosts = query(
  {
    args:{},
    handler: async (ctx) => {
     const posts=await ctx.db.query("posts").order("desc").collect();
     return await Promise.all(

      posts.map(async (post)=>{

const resolvedImageUrl=post.imageStorageId!==undefined?await ctx.storage.getUrl(post.imageStorageId):null;


return{
  ...post,
  imageUrl:resolvedImageUrl,
}

      })
     )
    }
  }
)

export const generateImageUploadUrl =mutation(
  {

    args:{},
    handler:async(ctx)=>{
      const user = await authComponent.safeGetAuthUser(ctx);
    
    if (!user) {
      throw new Error("Unauthorized - you must be logged in to create a post");
    }


    return await ctx.storage.generateUploadUrl()
    }
  }
)


export const getPostById=query({

  args:{
    postId:v.id('posts')
  },

  handler:async (ctx,args)=>{

    const post=await ctx.db.get(args.postId);

    if(!post){
      return null;
    }

    const resolvedImageUrl=
    post?.imageStorageId !== undefined 
    ? await ctx.storage.getUrl(post.imageStorageId)
    :null;

    return{
      ...post,
      imageUrl:resolvedImageUrl
    }


  }

})