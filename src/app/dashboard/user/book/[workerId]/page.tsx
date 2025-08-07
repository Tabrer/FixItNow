
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

import { DashboardHeader } from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { BookingForm } from '@/components/BookingForm';

interface Worker {
  id: string;
  fullName: string;
  serviceType: string;
  serviceArea: string;
  experience: string;
  yearsOfExperience: number;
}

export default function BookWorkerPage() {
  const router = useRouter();
  const params = useParams();
  const workerId = params.workerId as string;

  const [worker, setWorker] = useState<Worker | null>(null);
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
    if (workerId) {
      const fetchWorker = async () => {
        setLoading(true);
        const workerDocRef = doc(db, 'workers', workerId);
        const workerDocSnap = await getDoc(workerDocRef);

        if (workerDocSnap.exists()) {
          setWorker({ id: workerDocSnap.id, ...workerDocSnap.data() } as Worker);
        } else {
          console.error("No such worker document!");
          // Optionally, redirect to a not-found page
        }
        setLoading(false);
      };

      fetchWorker();
    }
  }, [workerId]);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader userName={userName} userRole="User" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 lg:max-w-4xl lg:mx-auto">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
                <Link href={`/dashboard/user/browse/${worker?.serviceType || 'plumber'}`}>
                    <ArrowLeft className="h-4 w-4" />
                </Link>
            </Button>
            <h1 className="font-headline text-2xl md:text-3xl font-bold tracking-tight">Book a Service</h1>
        </div>

        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        ) : worker ? (
          <BookingForm worker={worker} />
        ) : (
          <p>Worker not found.</p>
        )}
      </main>
    </div>
  );
}
