import { sign } from "crypto";
import {z} from "zod";

export const usernameValidation = z
    .string()
    .min(2,"username must be at least 2")
    .max(30,"username must be at most 30")
    .trim()
    .regex(/^[a-zA-Z0-9_]+$/,"username can only contain letters, numbers, and underscores");

export const signUpSchema = z.object({
        username:usernameValidation,
        email:z.string().email({message:"Invalid email address"}).trim(),
        password:z.string().min(8,"password must be at least 8 characters").max(100,"password must be at most 100 characters"),
})