import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench, User, Cog } from 'lucide-react';

const FixItNowLogo = () => (
  <div className="flex items-center justify-center text-primary h-24">
    <Wrench className="h-16 w-16 -rotate-45" />
    <Cog className="h-24 w-24 -ml-8 animate-spin-slow" />
  </div>
);

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 font-body">
      <div className="relative flex flex-col items-center justify-center h-full">
        <Card className="w-full max-w-md shadow-2xl animate-fade-in-up">
          <CardHeader className="items-center text-center">
            <FixItNowLogo />
            <CardTitle className="font-headline text-4xl mt-4 tracking-tighter">FixItNow</CardTitle>
            <CardDescription className="text-lg">Your on-demand service experts.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button asChild size="lg" className="w-full h-12 text-base">
              <Link href="/user-login">
                <User className="mr-2 h-5 w-5" />
                Book a Service
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="w-full h-12 text-base">
              <Link href="/worker-login">
                <Wrench className="mr-2 h-5 w-5" />
                Provide a Service
              </Link>
            </Button>
          </CardContent>
        </Card>
        <footer className="mt-8 text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} FixItNow. All Rights Reserved.
        </footer>
      </div>
    </main>
  );
}
