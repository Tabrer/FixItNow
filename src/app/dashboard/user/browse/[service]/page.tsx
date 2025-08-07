
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

import { DashboardHeader } from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Briefcase, MapPin } from 'lucide-react';
import Link from 'next/link';

interface Worker {
  id: string;
  fullName: string;
  serviceType: string;
  serviceArea: string;
  experience: string;
  yearsOfExperience: number;
}

export default function BrowseWorkersPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const service = params.service as string;

  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/user-login");
      } else {
        setUserName(user.displayName || user.email || "User");
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (service) {
      const fetchWorkers = async () => {
        setLoading(true);
        try {
          const workersRef = collection(db, 'workers');
          
          const specificServiceQuery = query(
            workersRef,
            where('serviceType', '==', service),
            where('isAvailable', '==', true),
            where('status', '==', 'APPROVED')
          );
          
          const allServiceQuery = query(
            workersRef,
            where('serviceType', '==', 'all'),
            where('isAvailable', '==', true),
            where('status', '==', 'APPROVED')
          );

          const [specificSnapshot, allSnapshot] = await Promise.all([
            getDocs(specificServiceQuery),
            getDocs(allServiceQuery)
          ]);

          const specificWorkers = specificSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Worker));
          const allWorkers = allSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Worker));
          
          const combinedWorkers = [...specificWorkers, ...allWorkers];
          const uniqueWorkers = Array.from(new Map(combinedWorkers.map(item => [item.id, item])).values());
          
          setWorkers(uniqueWorkers);

        } catch (error) {
          console.error("Error fetching workers:", error);
          toast({
            title: "Error",
            description: "Could not fetch available workers. This might be due to database permissions.",
            variant: "destructive",
          });
        }
        setLoading(false);
      };

      fetchWorkers();
    }
  }, [service, toast]);
  
  const serviceTitle = service ? service.charAt(0).toUpperCase() + service.slice(1) + 's' : 'Workers';

  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader userName={userName} userRole="User" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
                <Link href="/dashboard/user">
                    <ArrowLeft className="h-4 w-4" />
                </Link>
            </Button>
            <h1 className="font-headline text-2xl md:text-3xl font-bold tracking-tight">Available {serviceTitle}</h1>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => (
                <Card key={i}>
                    <CardHeader className="flex-row gap-4 items-center">
                        <Skeleton className="w-16 h-16 rounded-full" />
                        <div className="flex-1 space-y-2">
                           <Skeleton className="h-6 w-3/4" />
                           <Skeleton className="h-4 w-1/2" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <Skeleton className="h-4 w-full" />
                         <Skeleton className="h-4 w-5/6" />
                    </CardContent>
                    <CardFooter>
                         <Skeleton className="h-10 w-full" />
                    </CardFooter>
                </Card>
            ))}
          </div>
        ) : workers.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {workers.map(worker => (
              <Card key={worker.id} className="flex flex-col">
                <CardHeader className="flex-row gap-4 items-start">
                    <Avatar className="w-16 h-16 border">
                        <AvatarImage src={`https://placehold.co/128x128.png`} alt={worker.fullName} data-ai-hint="profile picture" />
                        <AvatarFallback>{worker.fullName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <CardTitle className="text-xl">{worker.fullName}</CardTitle>
                        <CardDescription>{worker.serviceType.charAt(0).toUpperCase() + worker.serviceType.slice(1)}</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow space-y-3">
                    <div className="flex items-start text-sm">
                        <Briefcase className="w-4 h-4 mr-2 mt-1 shrink-0" />
                        <span className="text-muted-foreground">{worker.yearsOfExperience}+ years of experience</span>
                    </div>
                     <div className="flex items-start text-sm">
                        <MapPin className="w-4 h-4 mr-2 mt-1 shrink-0" />
                        <span className="text-muted-foreground">Serves: {worker.serviceArea}</span>
                    </div>
                    <p className="text-sm text-muted-foreground pt-2 italic line-clamp-3">"{worker.experience}"</p>

                </CardContent>
                <CardFooter>
                    <Button className="w-full" asChild>
                      <Link href={`/dashboard/user/book/${worker.id}`}>Book Now</Link>
                    </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-10 text-center">
              <p className="text-lg font-medium">No Available Workers</p>
              <p className="text-muted-foreground">There are currently no available {serviceTitle} in your area. Please check back later.</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
