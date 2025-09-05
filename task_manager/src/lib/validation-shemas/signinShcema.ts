import z from 'zod'

export const signinSchema = z.object({
    email: z.email(),
    password: z.string().min(8, "Password must be at least 8 characters")
})

export type SigninInput = z.infer<typeof signinSchema>