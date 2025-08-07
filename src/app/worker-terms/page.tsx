import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function WorkerTermsPage() {
    return (
        <div className="bg-background min-h-screen">
            <div className="container mx-auto px-4 py-8 md:py-12">
                <Button asChild variant="ghost" className="mb-8">
                    <Link href="/worker-login">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Sign Up
                    </Link>
                </Button>

                <h1 className="font-headline text-4xl font-bold tracking-tight mb-6">Worker Terms and Conditions</h1>
                
                <div className="prose prose-lg dark:prose-invert max-w-none bg-card p-6 md:p-8 rounded-lg shadow">
                    <h2 className="font-headline">1. Agreement to Terms</h2>
                    <p>By registering as a service provider on FixItNow, you agree to be bound by these Worker Terms and Conditions. If you disagree with any part of the terms, you may not use our platform as a service provider.</p>
                    
                    <h2 className="font-headline">2. Service Provider Obligations</h2>
                    <p>As a service provider, you agree to:</p>
                    <ul>
                        <li>Provide accurate and complete information during registration and keep this information up to date.</li>
                        <li>Perform services to a professional standard of quality.</li>
                        <li>Maintain all necessary licenses and certifications for the services you provide.</li>
                        <li>Communicate clearly and professionally with users.</li>
                    </ul>

                    <h2 className="font-headline">3. Vetting and Background Checks</h2>
                    <p>You consent to FixItNow conducting vetting procedures, which may include identity verification and background checks, as permitted by law. We reserve the right to deactivate your account based on the results of these checks.</p>

                    <h2 className="font-headline">4. Payment Terms</h2>
                    <p>Payments for services rendered will be processed through the FixItNow platform. FixItNow will deduct a service fee from each transaction. Payment schedules and fee structures will be detailed in your provider dashboard.</p>

                    <h2 className="font-headline">5. Independent Contractor Status</h2>
                    <p>You acknowledge that you are an independent contractor and not an employee of FixItNow. You are responsible for your own taxes, insurance, and other legal obligations.</p>
                </div>
            </div>
        </div>
    );
}
