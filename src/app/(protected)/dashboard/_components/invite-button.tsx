"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useProject } from "@/hooks/use-project";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users, Copy, Check, Share2, Mail } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const InviteButton = () => {
  const { projectId } = useProject();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const inviteLink = `${window.location.origin}/join/${projectId}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join Our Project",
          text: "Click here to join our project!",
          url: inviteLink,
        });
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } catch (error) {
        console.log("Error sharing:", error);
      }
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Users className="h-5 w-5 text-blue-500" />
              Invite Team Members
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <p className="text-sm text-gray-500">
                Share this link with your team members to give them access to
                the project
              </p>

              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={inviteLink}
                  className="font-mono text-sm"
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleCopy}
                  className="shrink-0 transition-all duration-200 hover:bg-blue-50"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">
                    or share via
                  </span>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 hover:bg-blue-50"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 hover:bg-blue-50"
                  onClick={() =>
                    (window.location.href = `mailto:?subject=Join%20Our%20Project&body=${encodeURIComponent(inviteLink)}`)
                  }
                >
                  <Mail className="h-4 w-4" />
                  Email
                </Button>
              </div>
            </div>

            {showSuccess && (
              <Alert className="bg-green-50 text-green-800">
                <AlertDescription>Link shared successfully!</AlertDescription>
              </Alert>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="group flex items-center gap-2 hover:bg-blue-50"
      >
        <Users className="h-4 w-4 transition-all group-hover:scale-110" />
        Invite Team
      </Button>
    </>
  );
};

export default InviteButton;
