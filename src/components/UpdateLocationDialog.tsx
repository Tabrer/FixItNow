
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useLocation } from "@/hooks/use-location";

const locationSchema = z.object({
  zipCode: z.string().regex(/^\d{5}$/, "Please enter a valid 5-digit zip code."),
});

interface UpdateLocationDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (zipCode: string) => void;
  currentZipCode?: string;
}

export function UpdateLocationDialog({
  isOpen,
  onOpenChange,
  onSave,
  currentZipCode = "",
}: UpdateLocationDialogProps) {
  const form = useForm<z.infer<typeof locationSchema>>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      zipCode: currentZipCode,
    },
  });

  const watchZip = form.watch("zipCode");
  const { location: prospectiveLocation } = useLocation(watchZip);

  useEffect(() => {
    form.reset({ zipCode: currentZipCode });
  }, [currentZipCode, form]);

  const handleSubmit = (values: z.infer<typeof locationSchema>) => {
    onSave(values.zipCode);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Your Location</DialogTitle>
          <DialogDescription>
            Enter your 5-digit postal zip code to find services near you.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zip Code</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 10001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {prospectiveLocation && (
              <div className="text-sm text-muted-foreground">
                Location: {prospectiveLocation}
              </div>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Save Location</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
