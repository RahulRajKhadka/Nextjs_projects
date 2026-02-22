import { buttonVariants } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { fetchAuthQuery, preloadAuthQuery } from "@/lib/auth-server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Id } from "@/convex/_generated/dataModel";
import { Separator } from "@/components/ui/separator";
import { CommentSection } from "@/components/web/CommentSection";

interface PostIdRouteProps {
  params: Promise<{
    postId: string;
  }>;
}

export default async function PostIdRoute({ params }: PostIdRouteProps) {
    
    
    
  const { postId: postIdString } = await params;

  
  const postId = postIdString as Id<"posts">;

  const post = await fetchAuthQuery(api.posts.getPostById, { postId });

  const preloadedComments=await preloadAuthQuery(api.comment.getCommentsByPostId,
    { postId:postId,}
  );

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <Link
          className={buttonVariants({ variant: "ghost" })}
          href="/blog"
        >
          <ArrowLeft className="size-4" />
          Back to blog
        </Link>
        <h1 className="text-6xl font-extrabold mt-8">No Post found</h1>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in duration-500">
      <Link
        className={buttonVariants({ variant: "ghost" })}
        href="/blog"
      >
        <ArrowLeft className="size-4" />
        Back to blog
      </Link>

      <div className="relative w-full h-[400px] my-8 rounded-xl overflow-hidden shadow-lg">
        <Image
          src={
            post.imageUrl ??
            "https://static.vecteezy.com/system/resources/previews/050/686/446/non_2x/rocky-mountains-usacanada-is-the-beautiful-background-free-photo.jpg"
          }
          alt={post.title}
          fill
          priority
          className="object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>

      <article className="prose prose-lg dark:prose-invert max-w-none">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
        
        {post._creationTime && (
          <div className="text-sm text-muted-foreground mb-6">
            {new Date(post._creationTime).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        )}

       
       
      </article>


      <Separator className="my-8"/>
    <div className="mt-8 whitespace-pre-wrap leading-relaxed">
          {post.body}
        </div>


      <Separator className="my-8"/>
      <CommentSection preloadedComments={preloadedComments} />
    </div>
  );
}