import { httpRouter } from "convex/server";
import { auth, authComponent } from "./auth";

const http = httpRouter();

// Use the correct method for registering routes
authComponent.registerRoutes(http, () => auth);

export default http;