
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SocialLogins } from "@/components/SocialLogins";
import { useToast } from "@/components/ui/use-toast";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(1, { message: "Password is required." }),
});

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];

const fileSchema = z.any()
    .refine((files): files is FileList => files?.length > 0 ? files instanceof FileList : true, "File is required.")
    .refine(files => files?.length > 0 ? files[0].size <= MAX_FILE_SIZE : true, `Max file size is 5MB.`)
    .refine(files => files?.length > 0 ? ACCEPTED_FILE_TYPES.includes(files[0].type) : true, "Only .jpg, .jpeg, .png, and .pdf formats are supported.")
    .optional();


const signupSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters."),
    email: z.string().email("Invalid email address."),
    phone: z.string().min(10, "Phone number must be at least 10 digits."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
    serviceType: z.enum(["plumber", "electrician", "mechanic", "all"]),
    experience: z.string().min(10, "Please provide a brief description of your experience.").max(500),
    yearsOfExperience: z.coerce.number().min(0, "Years of experience cannot be negative."),
    serviceArea: z.string().min(3, "Service area is required."),
    willingToTravel: z.boolean().default(false),
    idProof: fileSchema,
    certifications: fileSchema,
    terms: z.boolean().refine(val => val === true, "You must accept the worker terms."),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
});


export function WorkerAuthForm() {
    const router = useRouter();
    const { toast } = useToast();

    const loginForm = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    const signupForm = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            fullName: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
            serviceType: "plumber",
            experience: "",
            yearsOfExperience: 0,
            serviceArea: "",
            willingToTravel: false,
            terms: false,
        },
    });
    
    async function onLoginSubmit(values: z.infer<typeof loginSchema>) {
        try {
            await signInWithEmailAndPassword(auth, values.email, values.password);
            toast({ title: "Login Successful", description: "Redirecting to your dashboard..." });
            router.push("/dashboard/worker");
        } catch (error: any) {
             console.error("Worker login failed:", error);
            let description = "An unexpected error occurred.";
            if (error.code === 'auth/invalid-credential') {
                description = "Invalid credentials. Please check your email and password.";
            } else {
                description = "Please check your credentials or account status.";
            }
            toast({
                title: "Login Failed",
                description: description,
                variant: "default",
            });
        }
    }

    async function onSignupSubmit(values: z.infer<typeof signupSchema>) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
            const user = userCredential.user;

            await setDoc(doc(db, "workers", user.uid), {
                fullName: values.fullName,
                email: values.email,
                phone: values.phone,
                serviceType: values.serviceType,
                experience: values.experience,
                yearsOfExperience: values.yearsOfExperience,
                serviceArea: values.serviceArea,
                willingToTravel: values.willingToTravel,
                status: "APPROVED",
                isAvailable: false,
                totalEarnings: 0,
                createdAt: serverTimestamp(),
            });

            toast({ title: "Registration Successful", description: "Redirecting to your dashboard." });
            router.push("/dashboard/worker");

        } catch (error: any) {
            console.error("Worker signup failed:", error);
            let description = "An unexpected error occurred.";
            if (error.code === 'auth/email-already-in-use') {
                description = "This email is already in use. Please try logging in instead.";
            } else {
                description = error.message;
            }
            toast({
                title: "Signup Failed",
                description: description,
                variant: "default",
            });
        }
    }

    return (
        <Card className="w-full shadow-lg">
            <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Worker Login</TabsTrigger>
                    <TabsTrigger value="signup">Worker Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                    <CardHeader>
                        <CardTitle className="font-headline tracking-tight">Worker Login</CardTitle>
                        <CardDescription>Access your dashboard to manage jobs.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Form {...loginForm}>
                            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                                <FormField control={loginForm.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email or Phone</FormLabel><FormControl><Input placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={loginForm.control} name="password" render={({ field }) => (<FormItem><div className="flex justify-between items-baseline"><FormLabel>Password</FormLabel><Link href="/forgot-password" className="text-sm text-primary hover:underline">Forgot Password?</Link></div><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <Button type="submit" className="w-full">Login</Button>
                            </form>
                        </Form>
                        <SocialLogins />
                    </CardContent>
                </TabsContent>

                <TabsContent value="signup">
                    <CardHeader>
                        <CardTitle className="font-headline tracking-tight">Become a Service Provider</CardTitle>
                        <CardDescription>Join our network of skilled professionals.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...signupForm}>
                            <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-6">
                                {/* Personal Info */}
                                <FormField control={signupForm.control} name="fullName" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField control={signupForm.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email Address</FormLabel><FormControl><Input placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={signupForm.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="+1 234 567 890" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField control={signupForm.control} name="password" render={({ field }) => (<FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={signupForm.control} name="confirmPassword" render={({ field }) => (<FormItem><FormLabel>Confirm Password</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                </div>

                                {/* Service Info */}
                                <FormField
                                    control={signupForm.control}
                                    name="serviceType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Service Type</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Select a service" /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    <SelectItem value="plumber">Plumber</SelectItem>
                                                    <SelectItem value="electrician">Electrician</SelectItem>
                                                    <SelectItem value="mechanic">Mechanic</SelectItem>
                                                    <SelectItem value="all">All of the above</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField control={signupForm.control} name="experience" render={({ field }) => (<FormItem><FormLabel>Experience Description</FormLabel><FormControl><Textarea placeholder="Briefly describe your experience and services offered..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={signupForm.control} name="yearsOfExperience" render={({ field }) => (<FormItem><FormLabel>Years of Experience</FormLabel><FormControl><Input type="number" placeholder="5" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                
                                {/* Location Info */}
                                <FormField control={signupForm.control} name="serviceArea" render={({ field }) => (<FormItem><FormLabel>Primary Service Area</FormLabel><FormControl><Input placeholder="e.g., Downtown, North Suburbs" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={signupForm.control} name="willingToTravel" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Willing to travel to other areas?</FormLabel></FormItem>)} />
                                
                                {/* Document Uploads */}
                                <FormField control={signupForm.control} name="idProof" render={({ field: { onChange, ...fieldProps} }) => (<FormItem><FormLabel>ID Proof (Optional)</FormLabel><FormControl><Input type="file" {...fieldProps} onChange={e => onChange(e.target.files)} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={signupForm.control} name="certifications" render={({ field: { onChange, ...fieldProps } }) => (<FormItem><FormLabel>Professional Certifications (Optional)</FormLabel><FormControl><Input type="file" {...fieldProps} onChange={e => onChange(e.target.files)}/></FormControl><FormMessage /></FormItem>)} />

                                {/* Terms */}
                                <FormField control={signupForm.control} name="terms" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel>I agree to the <Link href="/worker-terms" className="text-primary hover:underline">Fix It Now Worker Terms & Conditions</Link></FormLabel></div></FormItem>)} />
                                
                                <Button type="submit" className="w-full">Apply to Be a Worker</Button>
                            </form>
                        </Form>
                    </CardContent>
                </TabsContent>
            </Tabs>
        </Card>
    );
}

    