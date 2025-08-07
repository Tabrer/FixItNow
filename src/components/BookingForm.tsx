
"use client";

import { useRouter } from 'next/navigation';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Briefcase, MapPin, Calendar, Clock } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';

interface Worker {
  id: string;
  fullName: string;
  serviceType: string;
  serviceArea: string;
  experience: string;
  yearsOfExperience: number;
}

interface BookingFormProps {
  worker: Worker;
}

export function BookingForm({ worker }: BookingFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const handleBooking = async () => {
    const user = auth.currentUser;
    if (!user) {
      toast({
        title: "Not Authenticated",
        description: "You must be logged in to book a service.",
        variant: "destructive"
      });
      return;
    }

    try {
      await addDoc(collection(db, 'bookings'), {
        userId: user.uid,
        workerId: worker.id,
        workerName: worker.fullName,
        serviceType: worker.serviceType,
        status: 'PENDING',
        createdAt: serverTimestamp(),
      });

      toast({
        title: "Booking Request Sent!",
        description: `Your request has been sent to ${worker.fullName}. You will be notified upon confirmation.`,
      });
      
      router.push('/dashboard/user');

    } catch (error) {
      console.error("Error creating booking:", error);
      toast({
        title: "Booking Failed",
        description: "Could not create your booking request. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row gap-6">
        <Avatar className="w-24 h-24 border">
          <AvatarImage src={`https://placehold.co/128x128.png`} alt={worker.fullName} data-ai-hint="profile picture" />
          <AvatarFallback>{worker.fullName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="font-headline text-3xl">{worker.fullName}</CardTitle>
          <CardDescription className="text-lg">{worker.serviceType.charAt(0).toUpperCase() + worker.serviceType.slice(1)} Specialist</CardDescription>
          <div className="flex items-center text-sm text-muted-foreground mt-4">
            <Briefcase className="w-4 h-4 mr-2" />
            <span>{worker.yearsOfExperience}+ years of experience</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <MapPin className="w-4 h-4 mr-2" />
            <span>Serves: {worker.serviceArea}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2">About {worker.fullName.split(' ')[0]}</h3>
          <p className="text-muted-foreground italic">"{worker.experience}"</p>
        </div>
        <div className="space-y-2">
            <Label htmlFor="job-description">Job Details (Optional)</Label>
            <Textarea id="job-description" placeholder="Describe the issue you're facing..."/>
        </div>
         <div className="space-y-2">
            <Label>Schedule (Coming Soon)</Label>
            <div className="p-4 rounded-md border border-dashed flex items-center justify-center text-muted-foreground">
                <Calendar className="mr-2 h-5 w-5"/>
                <span>Date & Time selection will be available soon.</span>
            </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full md:w-auto ml-auto" size="lg" onClick={handleBooking}>
          <Clock className="mr-2" /> Confirm Booking Request
        </Button>
      </CardFooter>
    </Card>
  );
}
