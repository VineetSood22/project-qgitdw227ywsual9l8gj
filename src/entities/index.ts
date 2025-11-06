import { superdevClient } from "@/lib/superdev/client";

export const Destination = superdevClient.entity("Destination");
export const Trip = superdevClient.entity("Trip");
export const User = superdevClient.auth;
