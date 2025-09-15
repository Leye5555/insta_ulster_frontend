import { object, z } from "zod";

const loginSchema = object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .trim(),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
});

const signupSchema = object({
  email: z.string().email("Invalid email address.").trim(),
  username: z
    .string()
    .min(5, {
      message: "Username must be at least 5 characters.",
    })
    .max(10, {
      message: "Username must be at most 10 characters.",
    })
    .regex(/[a-zA-Z0-9_]/, {
      message: "Username contain no special characters.",
    })
    .trim(),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
  role: z.string(),
});
const postSchema = z.object({
  content: z.string().min(1, "Caption is required"),
  tags: z.string().optional(),
  imageTitle: z.string().optional(),
  imageLocation: z.string().optional(),
  imageAlt: z
    .string()
    .max(125, "Alt text should be under 125 characters")
    .optional(),
});

export { loginSchema, signupSchema, postSchema };

export type FormState =
  | {
      errors?: {
        username?: string[];
        email?: string[];
        password?: string[];
        role?: string[];
      };
      message?: string;
    }
  | undefined;
