import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
    return (
        <div className="bg-background min-h-screen">
            <div className="container mx-auto px-4 py-8 md:py-12">
                <Button asChild variant="ghost" className="mb-8">
                    <Link href="/user-login">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Sign Up
                    </Link>
                </Button>

                <h1 className="font-headline text-4xl font-bold tracking-tight mb-6">Terms and Conditions</h1>
                
                <div className="prose prose-lg dark:prose-invert max-w-none bg-card p-6 md:p-8 rounded-lg shadow">
                    <h2 className="font-headline">1. Introduction</h2>
                    <p>Welcome to FixItNow! These terms and conditions outline the rules and regulations for the use of FixItNow's Website, located at fixitnow.app.</p>
                    <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use FixItNow if you do not agree to take all of the terms and conditions stated on this page.</p>
                    
                    <h2 className="font-headline">2. Intellectual Property Rights</h2>
                    <p>Other than the content you own, under these Terms, FixItNow and/or its licensors own all the intellectual property rights and materials contained in this Website.</p>
                    <p>You are granted limited license only for purposes of viewing the material contained on this Website.</p>

                    <h2 className="font-headline">3. Restrictions</h2>
                    <p>You are specifically restricted from all of the following:</p>
                    <ul>
                        <li>publishing any Website material in any other media;</li>
                        <li>selling, sublicensing and/or otherwise commercializing any Website material;</li>
                        <li>publicly performing and/or showing any Website material;</li>
                        <li>using this Website in any way that is or may be damaging to this Website;</li>
                        <li>using this Website in any way that impacts user access to this Website;</li>
                    </ul>

                    <h2 className="font-headline">4. Your Content</h2>
                    <p>In these Website Standard Terms and Conditions, “Your Content” shall mean any audio, video text, images or other material you choose to display on this Website. By displaying Your Content, you grant FixItNow a non-exclusive, worldwide irrevocable, sub-licensable license to use, reproduce, adapt, publish, translate and distribute it in any and all media.</p>

                    <h2 className="font-headline">5. No warranties</h2>
                    <p>This Website is provided “as is,” with all faults, and FixItNow express no representations or warranties, of any kind related to this Website or the materials contained on this Website. Also, nothing contained on this Website shall be interpreted as advising you.</p>

                </div>
            </div>
        </div>
    );
}
