"use client";

import React, { useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";
import { uploadFile } from "@/lib/supabase";
import {
  PresentationIcon,
  UploadIcon,
  FileAudio,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useProject } from "@/hooks/use-project";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export const MeetingCard = () => {
  const { project } = useProject();
  const router = useRouter();
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const processMeeting = useMutation({
    mutationFn: async (data: { meetingUrl: string; meetingId: string }) => {
      const { meetingId, meetingUrl } = data;
      const response = await axios.post(`/api/process-meeting`, {
        meetingUrl,
        meetingId,
      });
      return response.data;
    },
  });

  const uploadMeeting = api.project.uploadMeeting.useMutation();

  const { getRootProps, getInputProps, isDragAccept, isDragReject } =
    useDropzone({
      accept: {
        "audio/*": [".mp3", ".wav", ".m4a"],
      },
      multiple: false,
      maxSize: 50_000_000,
      onDragEnter: () => setDragActive(true),
      onDragLeave: () => setDragActive(false),
      onDrop: async (acceptedFiles) => {
        setDragActive(false);
        setIsUploading(true);
        const file = acceptedFiles[0];

        try {
          const downloadUrl = await uploadFile(file as File, setProgress);
          uploadMeeting.mutate(
            {
              projectId: project!.id,
              meetingUrl: downloadUrl,
              name: file!.name,
            },
            {
              onSuccess: (meeting) => {
                toast.success("Meeting uploaded successfully!");
                router.push("/meetings");
                processMeeting.mutateAsync({
                  meetingUrl: downloadUrl,
                  meetingId: meeting.id,
                });
              },
              onError: () => {
                toast.error("Failed to upload meeting");
              },
            },
          );
        } catch (error) {
          toast.error("Failed to upload meeting");
          console.error("Upload error:", error);
        } finally {
          setIsUploading(false);
        }
      },
    });

  return (
    <Card
      {...getRootProps()}
      className={`relative col-span-2 cursor-pointer overflow-hidden transition-all duration-300 ${
        dragActive ? "ring-2 ring-violet-500 ring-offset-2" : ""
      }`}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-purple-50 opacity-50" />

      {/* Content container */}
      <div className="relative flex flex-col items-center justify-center p-10">
        <AnimatePresence mode="wait">
          {!isUploading ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center"
            >
              <div className="relative">
                <motion.div
                  animate={{
                    scale: dragActive ? 1.1 : 1,
                  }}
                  className="rounded-full bg-violet-100 p-4"
                >
                  <PresentationIcon className="size-8 text-violet-600" />
                </motion.div>
                <motion.div
                  animate={{
                    rotate: dragActive ? 180 : 0,
                  }}
                  className="absolute -right-2 -top-2 rounded-full bg-white p-1 shadow-lg"
                >
                  <FileAudio className="size-4 text-violet-600" />
                </motion.div>
              </div>

              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-lg font-semibold text-gray-900"
              >
                Create a new meeting
              </motion.h3>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-center text-sm text-gray-600"
              >
                Analyse your meeting with Codex
                <br />
                <span className="text-violet-600">Powered by AI</span>
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6"
              >
                <Button
                  disabled={isUploading}
                  className="group relative overflow-hidden bg-violet-600 px-6 py-2 transition-all hover:bg-violet-700"
                >
                  <motion.span
                    animate={{
                      x: dragActive ? 30 : 0,
                    }}
                    className="flex items-center gap-2"
                  >
                    <UploadIcon className="size-5 transition-transform duration-200 group-hover:-translate-y-1" />
                    Upload Meeting
                  </motion.span>
                  <input className="hidden" {...getInputProps()} />
                </Button>
              </motion.div>

              {dragActive && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-sm text-violet-600"
                >
                  Drop your audio file here
                </motion.div>
              )}

              {isDragReject && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex items-center gap-2 text-sm text-red-500"
                >
                  <AlertCircle className="size-4" />
                  Invalid file type
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="relative size-24">
                <CircularProgressbar
                  value={progress}
                  text={progress === 100 ? "100%" : ""}
                  styles={buildStyles({
                    pathColor: "#2563eb",
                    textColor: "#2563eb",
                    trailColor: "#dbeafe",
                    pathTransition: "stroke-dashoffset 0.5s ease",
                  })}
                />
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{
                    boxShadow: [
                      "0 0 0 0px rgba(37, 99, 235, 0.1)",
                      "0 0 0 12px rgba(37, 99, 235, 0)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
              </div>
              <div className="text-center">
                <p className="font-medium text-gray-900">
                  Uploading your meeting
                </p>
                <p className="text-sm text-gray-500">Please wait...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
};

export default MeetingCard;
