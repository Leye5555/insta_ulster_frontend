import { loginSchema, signupSchema } from "@/lib/definitions/schema";
import { FormState } from "@/lib/definitions/schema";
import { z } from "zod";
const signUp = async (state: FormState, data: z.infer<typeof signupSchema>) => {
  const validatedFields = signupSchema.safeParse(data);
  console.log(data);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  //   const res = await fetch("/api/auth/signup", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(data),
  //   });

  //   const result = await res.json();
  //   return result;
};

const login = async (state: FormState, data: z.infer<typeof loginSchema>) => {
  const validatedFields = loginSchema.safeParse(data);
  console.log(data);
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  //   const res = await fetch("/api/auth/login", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(data),
  //   });

  //   const result = await res.json();
  //   return result;
};

export { signUp, login };
