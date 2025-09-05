import z from "zod";

export const signupSchema = z.object({
    name: z.string().min(1, "Field is required"),
    email: z.email(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
});

export type SignupInput = z.infer<typeof signupSchema>