
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { DashboardHeader } from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Wrench, Bolt, Car, MapPin, Clock, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';
import { UpdateLocationDialog } from '@/components/UpdateLocationDialog';
import { useLocation } from '@/hooks/use-location';

interface Booking {
  id: string;
  serviceType: string;
  workerName: string;
  scheduledAt?: { toDate: () => Date };
  completedAt?: { toDate: () => Date };
  status: string;
}

interface UserData {
    fullName: string;
    zipCode?: string;
}

export default function UserDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  
  // The dashboard now manages the zipCode state directly
  const [zipCode, setZipCode] = useState<string | undefined>(undefined);
  const { location } = useLocation(zipCode);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setLoading(true);
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const fetchedUserData = userDocSnap.data() as UserData;
          setUserData(fetchedUserData);
          setZipCode(fetchedUserData.zipCode); // Set the zipCode from fetched data

          const bookingsQuery = query(collection(db, "bookings"), where("userId", "==", user.uid));
          const bookingsSnapshot = await getDocs(bookingsQuery);
          const userBookings = bookingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
          setBookings(userBookings);

        } else {
          console.log("No such user document!");
          router.push('/onboarding/profile');
        }
        setLoading(false);
      } else {
        router.push("/user-login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLocationSave = async (newZipCode: string) => {
      if (!auth.currentUser) return;
      
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      try {
        await updateDoc(userDocRef, { zipCode: newZipCode });
        setZipCode(newZipCode); // Update the state directly
        setUserData(prevData => prevData ? { ...prevData, zipCode: newZipCode } : null);
        toast({ title: "Location Updated", description: `Your location has been set to ${newZipCode}.` });
        setIsLocationDialogOpen(false);
      } catch (error) {
        console.error("Failed to update location:", error);
        toast({ title: "Update Failed", description: "Could not update your location."});
      }
  };
  
  const activeBookings = bookings.filter(b => b.status === 'PENDING' || b.status === 'CONFIRMED' || b.status === 'IN_PROGRESS');
  const pastBookings = bookings.filter(b => b.status === 'COMPLETED' || b.status === 'CANCELED');

  if (loading) {
    return (
        <div className="flex min-h-screen w-full flex-col">
            <DashboardHeader userName="User" userRole="User" />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <Skeleton className="h-10 w-1/3" />
                <Card><CardHeader><Skeleton className="h-8 w-1/4" /></CardHeader><CardContent><Skeleton className="h-24 w-full" /></CardContent></Card>
                <Card><CardHeader><Skeleton className="h-8 w-1/4" /></CardHeader><CardContent><Skeleton className="h-32 w-full" /></CardContent></Card>
                <Card><CardHeader><Skeleton className="h-8 w-1/4" /></CardHeader><CardContent><Skeleton className="h-32 w-full" /></CardContent></Card>
            </main>
        </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader userName={userData?.fullName || "User"} userRole="User" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
            <h1 className="font-headline text-2xl md:text-3xl font-bold tracking-tight">Welcome, {userData?.fullName?.split(' ')[0]}!</h1>
            <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">{location || 'Set your location'}</span>
                <Button variant="outline" size="sm" onClick={() => setIsLocationDialogOpen(true)}>Change</Button>
            </div>
        </div>
        
        <UpdateLocationDialog
            isOpen={isLocationDialogOpen}
            onOpenChange={setIsLocationDialogOpen}
            onSave={handleLocationSave}
            currentZipCode={zipCode}
        />

        <Card>
            <CardHeader>
                <CardTitle>Find a Service</CardTitle>
                <CardDescription>What do you need help with today?</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input placeholder="Search for plumbers, electricians, mechanics..." className="pl-10 h-12 text-lg" />
                </div>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Button asChild variant="secondary" className="h-16 text-base justify-start p-4">
                        <Link href="/dashboard/user/browse/plumber">
                            <Wrench className="h-6 w-6 mr-4" /> Plumbing
                        </Link>
                    </Button>
                    <Button asChild variant="secondary" className="h-16 text-base justify-start p-4">
                        <Link href="/dashboard/user/browse/electrician">
                            <Bolt className="h-6 w-6 mr-4" /> Electrical
                        </Link>
                    </Button>
                    <Button asChild variant="secondary" className="h-16 text-base justify-start p-4">
                        <Link href="/dashboard/user/browse/mechanic">
                            <Car className="h-6 w-6 mr-4" /> Mechanical
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Active Bookings</CardTitle>
                 {activeBookings.length === 0 && <CardDescription>You have no active bookings.</CardDescription>}
            </CardHeader>
             {activeBookings.length > 0 ? (
                <CardContent className="space-y-4">
                    {activeBookings.map((booking: Booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-4 rounded-lg border">
                            <div>
                                <p className="font-bold">{booking.serviceType}</p>
                                <p className="text-sm text-muted-foreground">with {booking.workerName || 'Awaiting Worker'}</p>
                                <p className="text-sm text-muted-foreground">
                                    <Clock className="inline h-4 w-4 mr-1" />
                                    {booking.scheduledAt ? format(booking.scheduledAt.toDate(), "EEE, MMM d, yyyy 'at' h:mm a") : "Not scheduled"}
                                </p>
                            </div>
                            <Badge variant={booking.status === 'PENDING' ? 'secondary' : 'default'}>{booking.status}</Badge>
                        </div>
                    ))}
                </CardContent>
            ) : (
                <CardContent className="text-center text-muted-foreground">
                    <p>Your scheduled services will appear here.</p>
                </CardContent>
            )}
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Past Bookings</CardTitle>
                {pastBookings.length === 0 && <CardDescription>You have no past bookings.</CardDescription>}
            </CardHeader>
            {pastBookings.length > 0 ? (
                 <CardContent className="space-y-4">
                    {pastBookings.map((booking: Booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-4 rounded-lg border">
                            <div>
                                <p className="font-bold">{booking.serviceType}</p>
                                 <p className="text-sm text-muted-foreground">with {booking.workerName || 'N/A'}</p>
                                <p className="text-sm text-muted-foreground">
                                    <CheckCircle className="inline h-4 w-4 mr-1" />
                                    {booking.completedAt ? format(booking.completedAt.toDate(), "EEE, MMM d, yyyy") : 'N/A'}
                                </p>
                            </div>
                            <Badge variant={booking.status === 'CANCELED' ? 'destructive' : 'outline'}>{booking.status}</Badge>
                        </div>
                    ))}
                </CardContent>
            ) : (
                <CardContent className="text-center text-muted-foreground">
                    <p>Completed services will be logged here for your reference.</p>
                </CardContent>
            )}
        </Card>
      </main>
    </div>
  );
}
