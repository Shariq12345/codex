"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs"; // Import useUser from Clerk
import { useProject } from "@/hooks/use-project";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useRefetch } from "@/hooks/use-refetch";
import { Archive, Loader2, AlertTriangle, Trash2Icon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const ArchiveButton = () => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [projectNameInput, setProjectNameInput] = useState("");
  const [ownerNameInput, setOwnerNameInput] = useState("");

  const archiveProject = api.project.archiveProject.useMutation();
  const { project, projectId } = useProject();
  const refetch = useRefetch();

  const { user } = useUser(); // Get the currently logged-in user's info
  const ownerName = user?.fullName || ""; // Use the full name from Clerk or fallback to an empty string

  const handleArchive = () => {
    archiveProject.mutate(
      { projectId },
      {
        onSuccess: () => {
          toast.success("Project archived successfully");
          refetch();
          setShowConfirmDialog(false);
        },
        onError: (error) => {
          toast.error("Failed to archive project");
          setShowConfirmDialog(false);
        },
      },
    );
  };

  const isDeleteDisabled =
    archiveProject.isPending ||
    projectNameInput !== project?.name ||
    ownerNameInput !== ownerName;

  return (
    <>
      {/* Archive Button */}
      <Button
        disabled={archiveProject.isPending}
        size="sm"
        variant="destructive"
        onClick={() => setShowConfirmDialog(true)}
        className="group relative overflow-hidden bg-red-500 hover:bg-red-600 active:bg-red-700"
      >
        <span className="flex items-center gap-2">
          {archiveProject.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Trash2Icon className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
          )}
          Delete
        </span>
      </Button>

      {/* Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="size-5" />
              Delete Project
            </DialogTitle>
            <DialogDescription className="pt-2 text-gray-600">
              <div className="space-y-2">
                <p>
                  This action{" "}
                  <span className="font-bold">cannot be undone</span>. It will
                  permanently delete the project, including all associated data.
                </p>
                <p>
                  To confirm, please type the name of the project{" "}
                  <span className="font-bold">{project?.name}</span> and the
                  owner's name <span className="font-bold">{ownerName}</span>.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>

          {/* Confirmation Form */}
          <div className="mt-4 space-y-4">
            <div>
              <label
                htmlFor="project-name"
                className="block text-sm font-medium text-gray-700"
              >
                Project Name
              </label>
              <Input
                id="project-name"
                type="text"
                placeholder={`Type "${project?.name}"`}
                value={projectNameInput}
                onChange={(e) => setProjectNameInput(e.target.value)}
                className="mt-1 w-full"
              />
            </div>

            <div>
              <label
                htmlFor="owner-name"
                className="block text-sm font-medium text-gray-700"
              >
                Owner's Name
              </label>
              <Input
                id="owner-name"
                type="text"
                placeholder={`Type "${ownerName}"`}
                value={ownerNameInput}
                onChange={(e) => setOwnerNameInput(e.target.value)}
                className="mt-1 w-full"
              />
            </div>
          </div>

          {/* Dialog Footer */}
          <DialogFooter className="mt-6 gap-2 sm:justify-start">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              className="mt-0"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleArchive}
              disabled={isDeleteDisabled}
              className={`bg-red-500 hover:bg-red-600 active:bg-red-700 ${
                isDeleteDisabled ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              {archiveProject.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2Icon className="size-4" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ArchiveButton;
