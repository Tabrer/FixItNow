
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, Search, Cog, Wrench, User, LogOut } from "lucide-react";
import { useToast } from "./ui/use-toast";

const FixItNowLogo = () => (
    <Link href="/" className="flex items-center gap-2" aria-label="FixItNow Homepage">
        <div className="flex items-center justify-center text-primary">
            <Wrench className="h-5 w-5 -rotate-45" />
            <Cog className="h-6 w-6 -ml-2" />
        </div>
        <span className="font-headline text-xl hidden sm:inline-block font-bold tracking-tighter">FixItNow</span>
    </Link>
);


export function DashboardHeader({ userName, userRole }: { userName: string, userRole: 'User' | 'Worker' }) {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
      router.push('/');
    } catch (error) {
      console.error("Error signing out: ", error);
      toast({ title: "Logout Failed", description: "An error occurred while logging out." });
    }
  };

  const handleComingSoon = (feature: string) => {
    toast({ title: "Coming Soon!", description: `${feature} functionality is not yet implemented.`});
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <FixItNowLogo />
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <FixItNowLogo />
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={`Search ${userRole === 'User' ? 'services...' : 'jobs...'}`}
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
        </form>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage src={`https://placehold.co/40x40.png`} alt={userName} />
                <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => handleComingSoon('Profile')}>
              <User className="mr-2 h-4 w-4"/>
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleComingSoon('Settings')}>
              <Cog className="mr-2 h-4 w-4"/>
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleLogout}>
                <LogOut className="mr-2 h-4 w-4"/>
                <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
