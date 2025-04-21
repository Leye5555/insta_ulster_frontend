"use client";
import { useFormState, useFormStatus } from "react-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginSchema, signupSchema } from "@/lib/definitions/schema";
import { login, signUp } from "@/app/actions/auth";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function AuthForm({ isSignUp = true }: { isSignUp?: boolean }) {
  const form = useForm<z.infer<typeof loginSchema | typeof signupSchema>>({
    resolver: zodResolver(loginSchema),
  });
  const [, signUpAction] = useFormState(signUp, undefined);
  const [, loginAction] = useFormState(login, undefined);

  const onSubmit = (
    data: z.infer<typeof loginSchema | typeof signupSchema>
  ) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        action={(formData) =>
          isSignUp
            ? signUpAction({
                email: formData.get("email") as string,
                username: formData.get("username") as string,
                password: formData.get("password") as string,
              })
            : loginAction({
                username: formData.get("username") as string,
                password: formData.get("password") as string,
              })
        }
        className="max-w-[300px] space-y-6 flex flex-col"
      >
        {isSignUp && (
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="email" type="email" {...field} />
                </FormControl>
                <FormDescription>
                  Please use a valid email address
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="password" type="password" {...field} />
              </FormControl>
              <FormDescription>
                Your password must be at least 6 characters long.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <CustomButton />
        {isSignUp ? (
          <p>
            Have an account already?{" "}
            <Link className="text-[#9CB8FF]" href="/login">
              Login
            </Link>
          </p>
        ) : (
          <p>
            Don&lsquo;t have an account?{" "}
            <Link className="text-[#9CB8FF]" href="/signup">
              Sign Up
            </Link>
          </p>
        )}
      </form>
    </Form>
  );
}

function CustomButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className={cn(
        "max-w-[150px] min-w-[100px] mx-auto block",
        pending && "pointer-events-none opacity-50"
      )}
    >
      Submit
    </Button>
  );
}
