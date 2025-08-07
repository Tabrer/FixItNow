import type { ReactNode } from 'react';
import Link from 'next/link';
import { Wrench, Cog } from 'lucide-react';

const FixItNowLogo = () => (
    <Link href="/" className="flex items-center justify-center text-primary mb-6 group" aria-label="Back to Homepage">
        <div className="flex items-center justify-center">
            <Wrench className="h-8 w-8 -rotate-45 transition-transform group-hover:rotate-[-60deg]" />
            <Cog className="h-10 w-10 -ml-3.5 animate-spin-slow" />
        </div>
        <span className="font-headline text-3xl ml-2 text-foreground tracking-tighter">FixItNow</span>
    </Link>
);

export function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-md">
                <FixItNowLogo />
                {children}
            </div>
        </div>
    );
}
