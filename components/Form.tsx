"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
import { login, register, reset } from "@/services/redux/slices/authSlice";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/services/redux/store";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function AuthForm({ isSignUp = true }: { isSignUp?: boolean }) {
  const registerForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
  });
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);
  const onSubmit = (
    data: z.infer<typeof loginSchema | typeof signupSchema>
  ) => {
    setPending(true);
    if (isSignUp) {
      const validated = signupSchema.safeParse(data);

      if (!validated.success) return;
      dispatch(
        register(
          data as {
            username: string;
            role: string;
            password: string;
            email: string;
          }
        )
      );
    } else {
      const validated = loginSchema.safeParse(data);

      if (!validated.success) return;
      dispatch(login(data));
    }
  };

  useEffect(() => {
    if (authState.status === "succeeded_register") {
      setPending(false);
      toast.success("Account created successfully, Login to continue", {
        id: "success",
      });
      setTimeout(() => router.push("/login"), 1000);
    } else if (authState.status === "succeeded_login") {
      setPending(false);
      toast.success("Login successful", {
        id: "success",
      });
      setTimeout(() => router.push("/"), 1000);
    } else if (authState.status === "failed") {
      setPending(false);
      toast.success("something went wrong", {
        id: "error",
      });
      reset();
    }
  }, [authState]);

  return (
    <>
      {isSignUp ? (
        <Form {...registerForm}>
          <form
            onSubmit={registerForm.handleSubmit(onSubmit)}
            className="max-w-[300px] space-y-6 flex flex-col"
          >
            <FormField
              control={registerForm.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Email</FormLabel>
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

            <FormField
              control={registerForm.control}
              name="username"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" type="text" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={registerForm.control}
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

            <FormField
              control={registerForm.control}
              name="role"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Select required onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem defaultChecked value="user">
                          User
                        </SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Your role can be changed later
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className={cn(
                "max-w-[150px] min-w-[100px] mx-auto block",
                pending && "pointer-events-none opacity-50"
              )}
            >
              Submit
            </Button>

            <p>
              Have an account already?{" "}
              <Link className="text-[#9CB8FF]" href="/login">
                Login
              </Link>
            </p>
          </form>
        </Form>
      ) : (
        <Form {...loginForm}>
          <form
            onSubmit={loginForm.handleSubmit(onSubmit)}
            className="max-w-[300px] space-y-6 flex flex-col"
          >
            <FormField
              control={loginForm.control}
              name="username"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" type="text" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={loginForm.control}
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

            <Button
              type="submit"
              className={cn(
                "max-w-[150px] min-w-[100px] mx-auto block opacity-100",
                pending && "pointer-events-none opacity-50"
              )}
            >
              Submit
            </Button>

            <p>
              Don&lsquo;t have an account?{" "}
              <Link className="text-[#9CB8FF]" href="/signup">
                Sign Up
              </Link>
            </p>
          </form>
        </Form>
      )}
    </>
  );
}
