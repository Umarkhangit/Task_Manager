'use client'

import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupInput } from "@/lib/validation-shemas/signupSchema"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const Registration = () => {

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<SignupInput>({
        resolver: zodResolver(signupSchema),
        mode: "onTouched",
        reValidateMode: "onChange"
    })

    const router = useRouter()

    const onSubmit = async (data: SignupInput) => {
        try {
            await authClient.signUp.email({
                email: data.email,
                password: data.password,
                name: data.name,
                callbackURL: "/"
            }, {
                onError: (ctx) => {
                    toast(ctx.error.message)
                },
                onSuccess: () => {
                    reset()
                    router.push("/")
                    toast("Signed up successfully ✅")
                }
            })
        } catch (err: unknown) {
            console.error(err);
            toast("Signup failed.");
        }
    }


    return (
        <div className="h-screen flex justify-center items-center">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Create new account</CardTitle>
                    <CardAction>
                        <Button variant="link" className="cursor-pointer">
                            <Link href="/signin" className="text-blue-500">Login</Link>
                        </Button>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="fullName">Full name</Label>
                                <Input id="fullName" {...register("name")} />
                                {errors.name && <span className="text-red-500">{errors.name.message}</span>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" {...register("email")} />
                                {errors.email && <span className="text-red-500">{errors.email.message}</span>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" {...register("password")} />
                                {errors.password && <span className="text-red-500">{errors.password.message}</span>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="cPassword">Confirm Password</Label>
                                <Input id="cPassword" type="password" {...register("confirmPassword")} />
                                {errors.confirmPassword && <span className="text-red-500">{errors.confirmPassword.message}</span>}
                            </div>
                            <div className="grip gap-2">
                                <Input type="submit" value={isSubmitting ? "Submitting..." : "Register"} className="bg-black text-white cursor-pointer" />
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>

    )
}

export default Registration

