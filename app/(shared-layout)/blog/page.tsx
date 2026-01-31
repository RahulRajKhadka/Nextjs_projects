import { buttonVariants } from "@/components/ui/button";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { fetchAuthQuery } from "@/lib/auth-server";
import { Divide } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export default function BlogPage() {
  return (
    <div className="py-12">
      <div className="text-center pb-12">
        <h1 className="text-4xl font-exrabold tracking-tight sm:text-5xl">
          Our Blog
        </h1>
        <p className="pt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
          Insights, thouts, and trnds from our team.
        </p>
      </div>
      <Suspense
  fallback={<SkeletonLaodingUi/>
    
  }
>
  <LoadBlogList />
</Suspense>

    </div>
  );
}

async function LoadBlogList() {
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const data = await fetchAuthQuery(api.posts.getPosts);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {data?.map((post) => (
        <Card key={post._id} className="pt-0">
          <div className=" relative h-48 w-full overflow-hidden">
            <Image
              src="https://media.istockphoto.com/id/485371557/photo/twilight-at-spirit-island.jpg?s=612x612&w=0&k=20&c=FSGliJ4EKFP70Yjpzso0HfRR4WwflC6GKfl4F3Hj7fk="
              alt="Image"
              fill
              className="rounded-t-lg"
            />
          </div>

          <CardContent>
            <Link href={`/blog/${post._id}`}>
              <h1>{post.title}</h1>
            </Link>

            <p className="text-muted-foreground line-clamp-3 ">{post.body}</p>
          </CardContent>

          <CardFooter>
            <Link className={buttonVariants({})} href={`/blog/${post._id}`}>
              Read More
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

function SkeletonLaodingUi(){

    return (

<div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex flex-col space-y-3">
       <Skeleton className="h-48 w-full rounded-2xl"/>
       <div className="spce-y-2 flex flex-col">

        <Skeleton className="h-6 w-3/4"/>
        
        <Skeleton className="h-6 w-full"/>
        
        <Skeleton className="h-6 w-2/3"/>
       
       </div>
        </div>
      ))}
    </div>
    )
}