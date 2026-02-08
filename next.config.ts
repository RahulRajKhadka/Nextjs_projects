import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  images:{

    remotePatterns:[
      {
        hostname:"static.vecteezy.com",

        protocol:"https",
        port:"",
  },
{

  hostname:"decisive-blackbird-123.convex.cloud",

        protocol:"https",
        port:"",
  }

]

}

}

export default nextConfig;
