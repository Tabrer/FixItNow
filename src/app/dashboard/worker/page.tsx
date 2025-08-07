
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { DashboardHeader } from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';

interface WorkerData {
    fullName: string;
    isAvailable: boolean;
    serviceType: string;
    status: string;
    totalEarnings: number;
}

interface Job {
    id: string;
    serviceType: string;
    status: string;
    createdAt?: { toDate: () => Date };
    completedAt?: { toDate: () => Date };
}

export default function WorkerDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [workerData, setWorkerData] = useState<WorkerData | null>(null);
  const [jobRequests, setJobRequests] = useState<Job[]>([]);
  const [jobHistory, setJobHistory] = useState<Job[]>([]);
  const [stats, setStats] = useState({ totalEarnings: 0, completedJobs: 0 });
  const [loading, setLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
            const workerDocRef = doc(db, "workers", user.uid);
            const workerDocSnap = await getDoc(workerDocRef);

            if (workerDocSnap.exists()) {
                const data = workerDocSnap.data() as WorkerData;
                setWorkerData(data);
                setIsAvailable(data.isAvailable || false);

                // Fetch jobs assigned to this worker
                const jobsQuery = query(collection(db, "bookings"), where("workerId", "==", user.uid));
                const jobsSnapshot = await getDocs(jobsQuery);
                const allJobs = jobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));

                setJobRequests(allJobs.filter(j => j.status === 'CONFIRMED'));
                const completed = allJobs.filter(j => j.status === 'COMPLETED');
                const canceled = allJobs.filter(j => j.status === 'CANCELED');
                setJobHistory([...completed, ...canceled]);
                
                setStats({ totalEarnings: data.totalEarnings || 0, completedJobs: completed.length });

            } else {
                console.log("No such worker document!");
                router.push('/worker-login');
            }
        } else {
            router.push('/worker-login');
        }
        setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);


  const handleAvailabilityChange = async (checked: boolean) => {
      setIsAvailable(checked);
      if (auth.currentUser) {
          const workerDocRef = doc(db, "workers", auth.currentUser.uid);
          await updateDoc(workerDocRef, { isAvailable: checked });
          toast({ title: `Availability updated to: ${checked ? 'Available' : 'Unavailable'}`});
      }
  }

  const handleActionClick = (action: string, jobId: string) => {
      toast({ title: "Coming Soon!", description: `${action} action for job ${jobId} is not implemented.`});
  }

  if (loading) {
    return (
        <div className="flex min-h-screen w-full flex-col">
            <DashboardHeader userName="Worker" userRole="Worker" />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <Skeleton className="h-10 w-1/3" />
                <div className="grid gap-4 md:grid-cols-3">
                    <Card><CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader><CardContent><Skeleton className="h-12 w-full" /></CardContent></Card>
                    <Card><CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader><CardContent><Skeleton className="h-12 w-full" /></CardContent></Card>
                    <Card><CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader><CardContent><Skeleton className="h-12 w-full" /></CardContent></Card>
                </div>
                <Card><CardHeader><Skeleton className="h-8 w-1/4" /></CardHeader><CardContent><Skeleton className="h-32 w-full" /></CardContent></Card>
                <Card><CardHeader><Skeleton className="h-8 w-1/4" /></CardHeader><CardContent><Skeleton className="h-32 w-full" /></CardContent></Card>
            </main>
        </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader userName={workerData?.fullName || 'Worker'} userRole="Worker" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
            <h1 className="font-headline text-2xl md:text-3xl font-bold tracking-tight">Worker Dashboard</h1>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Switch id="availability" checked={isAvailable} onCheckedChange={handleAvailabilityChange} />
                    <label htmlFor="availability" className="font-medium">Available for Jobs</label>
                </div>
                <Button onClick={() => handleActionClick('Update Schedule', 'N/A')}>Update Schedule</Button>
            </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${stats.totalEarnings.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">Based on completed jobs</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+{stats.completedJobs}</div>
                    <p className="text-xs text-muted-foreground">All time</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{jobRequests.length}</div>
                     <p className="text-xs text-muted-foreground">Respond to get hired</p>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>New Job Requests</CardTitle>
                 {jobRequests.length > 0 ? (
                    <CardDescription>You have {jobRequests.length} new job requests.</CardDescription>
                 ) : (
                    <CardDescription>You have no new job requests.</CardDescription>
                 )}
            </CardHeader>
             {jobRequests.length > 0 ? (
                 <CardContent className="space-y-4">
                    {jobRequests.map((job: Job) => (
                        <div key={job.id} className="flex items-center justify-between p-4 rounded-lg border">
                             <div>
                                <p className="font-bold capitalize">{job.serviceType}</p>
                                <p className="text-sm text-muted-foreground">
                                    Requested {job.createdAt ? format(job.createdAt.toDate(), "MMM d, yyyy") : 'N/A'}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => handleActionClick('Details', job.id)}>Details</Button>
                                <Button size="sm" onClick={() => handleActionClick('Accept', job.id)}>Accept</Button>
                            </div>
                        </div>
                    ))}
                 </CardContent>
             ) : (
                <CardContent className="text-center text-muted-foreground p-10">
                    <p>New job requests from users will appear here.</p>
                </CardContent>
             )}
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Job History</CardTitle>
                <CardDescription>A log of your completed and canceled jobs.</CardDescription>
            </CardHeader>
            {jobHistory.length > 0 ? (
                <CardContent className="space-y-4">
                    {jobHistory.map((job: Job) => (
                         <div key={job.id} className="flex items-center justify-between p-4 rounded-lg border">
                            <div>
                                <p className="font-bold capitalize">{job.serviceType}</p>
                                <p className="text-sm text-muted-foreground">
                                     {job.completedAt ? `Completed on ${format(job.completedAt.toDate(), "MMM d, yyyy")}` : `Canceled`}
                                </p>
                            </div>
                            <Badge variant={job.status === 'CANCELED' ? 'destructive' : 'outline'}>{job.status}</Badge>
                        </div>
                    ))}
                </CardContent>
            ) : (
                <CardContent className="text-center text-muted-foreground p-10">
                    <p>Your job history will be displayed here.</p>
                </CardContent>
            )}
        </Card>
      </main>
    </div>
  );
}
