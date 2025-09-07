'use client'

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { authClient } from "@/lib/auth-client"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema, type SigninInput } from "@/lib/validation-shemas/signinShcema"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const Signin = () => {

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<SigninInput>({
    resolver: zodResolver(signinSchema),
    mode: "onTouched",
    reValidateMode: "onChange"
  })
  const [isGoogleSigning, setIsGoogleSigning] = useState(false)
  const [isGithubSigning, setIsGithubSigning] = useState(false)

  const router = useRouter()

  const onSubmit = async (data: SigninInput) => {
    try {
      await authClient.signIn.email({
        email: data.email,
        password: data.password
      }, {
        onError: (ctx) => {
          toast(ctx.error.message)
        },
        onSuccess: (ctx) => {
          sessionStorage.setItem("auth", JSON.stringify(ctx))
          reset()
          router.push("/")
          toast("Signed in successfully ✅")
        }
      })
    } catch (err: unknown) {
      console.error(err);
      toast("Signin failed.");
    }
  }

  const googleLogin = async () => {
    setIsGoogleSigning(true)

    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/"
    }, {
      onSuccess: () => {
        setIsGoogleSigning(false)
        toast("Signed in successfully using Google")
      }
    })
  }

  const githubLogin = async () => {
    setIsGithubSigning(true)

    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/"
    }, {
      onSuccess: () => {
        setIsGithubSigning(false)
        toast("Signed in successfully using Github")
      }
    })
  }

  return (
    <div className="flex justify-center mt-28">
      <div className="w-full max-w-sm">
        <Card >
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input type="email" {...register("email")} />
                  {errors.email && <span className="text-red-500">{errors.email.message}</span>}
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">Forgot your password?</a>
                  </div>
                  <Input type="password" {...register("password")} />
                  {errors.password && <span className="text-red-500">{errors.password.message}</span>}
                </div>
                <Input type="submit" className="bg-black text-white cursor-pointer" value={isSubmitting ? "Submitting..." : "Login"} />
                <Separator />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button variant="outline" className="w-full cursor-pointer" type="button" onClick={googleLogin}>
              {isGoogleSigning ? "Signing in..." : "Continue with Google"}
            </Button>
            <Button variant="outline" className="w-full cursor-pointer" type="button" onClick={githubLogin}>
              {isGithubSigning ? "Signing in..." : "Continue with Github"}
            </Button>
          </CardFooter>
        </Card>
        <div className="flex justify-center mt-20">New user? <Link href="/registration" className="text-blue-500 ml-2">Signup</Link></div>
      </div>

    </div>
  )
}

export default Signin
