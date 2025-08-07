"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const forgotPasswordSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address." }),
});

export function ForgotPasswordForm() {
    const { toast } = useToast();
    const form = useForm<z.infer<typeof forgotPasswordSchema>>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: "" },
    });

    function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
        console.log("Forgot password for:", values.email);
        toast({
            title: "Password Reset Link Sent",
            description: "If an account exists with that email, you will receive a reset link shortly.",
        });
        form.reset();
    }

    return (
        <Card className="w-full shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline tracking-tight">Forgot Your Password?</CardTitle>
                <CardDescription>No worries. Enter your email and we'll send you a reset link.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="you@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">Send Reset Link</Button>
                    </form>
                </Form>
                 <Button variant="link" className="w-full text-muted-foreground" asChild>
                    <Link href="/user-login">
                       <ChevronLeft className="h-4 w-4 mr-1" /> Back to Login
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}
