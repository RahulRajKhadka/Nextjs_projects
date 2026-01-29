

import { buttonVariants } from "@/components/ui/button";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { fetchAuthQuery } from "@/lib/auth-server";
import Image from "next/image";
import Link from "next/link";

export default async function BlogPage() {

    const data=await fetchAuthQuery(api.posts.getPosts)


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
                <Link className={buttonVariants({
                }) } href={`/blog/${post._id}`}>Read More
                
                </Link>

            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
