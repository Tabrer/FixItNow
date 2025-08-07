
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Tabs, TabsContent, TabsList, TabsTrigger
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { SocialLogins } from "@/components/SocialLogins";
import { useToast } from "@/components/ui/use-toast";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";


const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(1, { message: "Password is required." }),
});

const signupSchema = z.object({
    fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
    email: z.string().email({ message: "Invalid email address." }),
    phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
    password: z.string().min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z.string(),
    terms: z.boolean().refine(val => val === true, { message: "You must accept the terms and conditions." }),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
});

export function UserAuthForm() {
    const router = useRouter();
    const { toast } = useToast();

    const loginForm = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    const signupForm = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: { fullName: "", email: "", phone: "", password: "", confirmPassword: "", terms: false },
    });

    async function onLoginSubmit(values: z.infer<typeof loginSchema>) {
        try {
            await signInWithEmailAndPassword(auth, values.email, values.password);
            toast({ title: "Login Successful", description: "Redirecting to your dashboard..." });
            router.push("/dashboard/user");
        } catch (error: any) {
            console.error("Login failed:", error);
            let description = "An unexpected error occurred.";
            if (error.code === 'auth/invalid-credential') {
                description = "Invalid credentials. Please check your email and password.";
            } else {
                description = error.message;
            }
            toast({
                title: "Login Failed",
                description: description,
            });
        }
    }

    async function onSignupSubmit(values: z.infer<typeof signupSchema>) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                fullName: values.fullName,
                email: values.email,
                phone: values.phone,
                createdAt: serverTimestamp(),
            });

            toast({ title: "Signup Successful", description: "Let's complete your profile." });
            router.push("/onboarding/profile");

        } catch (error: any) {
            console.error("Signup failed:", error);
            let description = "An unexpected error occurred.";
            if (error.code === 'auth/email-already-in-use') {
                description = "This email is already in use. Please log in instead.";
            } else {
                description = error.message;
            }
            toast({
                title: "Signup Failed",
                description: description,
            });
        }
    }

    return (
        <Card className="w-full shadow-lg">
            <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                    <CardHeader>
                        <CardTitle className="font-headline tracking-tight">Welcome Back!</CardTitle>
                        <CardDescription>Log in to book your next service.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Form {...loginForm}>
                            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                                <FormField
                                    control={loginForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl><Input placeholder="you@example.com" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={loginForm.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex justify-between items-baseline">
                                                <FormLabel>Password</FormLabel>
                                                <Link href="/forgot-password"
                                                      className="text-sm text-primary hover:underline">
                                                    Forgot Password?
                                                </Link>
                                            </div>
                                            <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full">Login</Button>
                            </form>
                        </Form>
                        <SocialLogins />
                    </CardContent>
                </TabsContent>
                <TabsContent value="signup">
                    <CardHeader>
                        <CardTitle className="font-headline tracking-tight">New Here?</CardTitle>
                        <CardDescription>Create an account to get started.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Form {...signupForm}>
                            <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                                <FormField control={signupForm.control} name="fullName" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={signupForm.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={signupForm.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="+1 234 567 890" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={signupForm.control} name="password" render={({ field }) => (<FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={signupForm.control} name="confirmPassword" render={({ field }) => (<FormItem><FormLabel>Confirm Password</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={signupForm.control} name="terms" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel>I agree to the <Link href="/terms" className="text-primary hover:underline">Terms & Conditions</Link></FormLabel></div></FormItem>)} />
                                <Button type="submit" className="w-full">Sign Up</Button>
                            </form>
                        </Form>
                        <SocialLogins />
                    </CardContent>
                </TabsContent>
            </Tabs>
        </Card>
    );
}
