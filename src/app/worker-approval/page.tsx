import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';

export default function WorkerApprovalPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg text-center shadow-lg">
        <CardHeader>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Clock className="h-8 w-8" />
            </div>
          <CardTitle className="font-headline text-3xl mt-4">Application Submitted!</CardTitle>
          <CardDescription className="text-base">
            Thank you for registering with FixItNow. Your application is now under review.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            We will notify you via email once your account has been approved. This usually takes 2-3 business days.
          </p>
          <Button asChild className="mt-6">
            <Link href="/">Return to Homepage</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
