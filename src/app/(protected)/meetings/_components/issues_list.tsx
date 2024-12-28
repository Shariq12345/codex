"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api, RouterOutputs } from "@/trpc/react";
import {
  VideoIcon,
  AlertCircle,
  Clock,
  ChevronRight,
  Calendar,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";

interface IssuesListProps {
  meetingId: string;
}

const IssuesList = ({ meetingId }: IssuesListProps) => {
  const { data: meeting, isLoading } = api.project.getMeetingById.useQuery(
    {
      meetingId,
    },
    {
      refetchInterval: 4000,
    },
  );

  if (isLoading || !meeting) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-pulse text-gray-500">
          <div className="flex items-center gap-2">
            <AlertCircle className="size-5 animate-spin" />
            Loading meeting details...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-7xl"
      >
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-x-8 border-b border-gray-200/80 pb-6 lg:mx-0 lg:max-w-none">
          <div className="flex items-center gap-x-6">
            <div className="rounded-full bg-blue-50 p-3 shadow-sm transition-all duration-200 hover:bg-blue-100">
              <VideoIcon className="size-5 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="size-4" />
                {meeting.createdAt.toLocaleDateString()}
              </div>
              <h1 className="mt-1 text-xl font-semibold leading-6 text-gray-900">
                {meeting.name}
              </h1>
            </div>
          </div>
        </div>

        <motion.div
          className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial="hidden"
          animate="show"
        >
          {meeting.issues.map((issue, index) => (
            <motion.div
              key={issue.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <IssueCard issue={issue} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default IssuesList;

const IssueCard = ({
  issue,
}: {
  issue: NonNullable<
    RouterOutputs["project"]["getMeetingById"]
  >["issues"][number];
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <AlertCircle className="size-5 text-blue-600" />
              {issue.gist}
            </DialogTitle>
            <DialogDescription className="flex items-center gap-2">
              <Calendar className="size-4" />
              {issue.createdAt.toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <p className="text-gray-600">{issue.headline}</p>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="size-4" />
                <span>
                  {issue.start} - {issue.end}
                </span>
              </div>
              <p className="mt-2 font-medium italic leading-relaxed text-gray-900">
                {issue.summary}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Card
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative overflow-hidden transition-all duration-200 hover:shadow-lg"
      >
        <div
          className={`absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 transition-opacity duration-200 ${
            isHovered ? "opacity-100" : ""
          }`}
          style={{ pointerEvents: "none" }} // Allow interactions with underlying elements
        />
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertCircle className="size-4 text-blue-600" />
            {issue.gist}
          </CardTitle>
          <div className="border-b border-gray-200/80" />
          <CardDescription className="line-clamp-2">
            {issue.headline}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2 transition-all duration-200"
          >
            Details
            <ChevronRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Button>
        </CardContent>
      </Card>
    </>
  );
};
