import { NextResponse } from "next/server";

export async function  POST() {
    
    console.log("Hello form the server action");

    return NextResponse.json({message: "Hello from the server action"});
    
    
}