import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({children}: {children: React.ReactNode}) {

  return(
<div className="min-h-screen flex itmes-center justify-center mt-40">
    <div className="flex flex-col items-center space-y-4">
      <Link href="/" className={buttonVariants({ variant: "ghost" })}>
      <ArrowLeft size={30} />
      Go Back
      </Link>
    </div>

    <div className="w-full max-w-md mx-auto">{children}</div>
  </div>


  ) 

}