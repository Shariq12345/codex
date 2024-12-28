"use client";
import React from "react";
import { useProject } from "@/hooks/use-project";
import { api } from "@/trpc/react";
import { MeetingCard } from "../dashboard/_components/meeting-card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { useRefetch } from "@/hooks/use-refetch";

const MeetingsPage = () => {
  const { projectId } = useProject();
  const { data: meetings, isLoading } = api.project.getMeetings.useQuery(
    { projectId },
    {
      refetchInterval: 5000,
    },
  );

  const deleteMeeting = api.project.deleteMeeting.useMutation();

  const refetch = useRefetch();

  return (
    <>
      <MeetingCard />
      <div className="h-6"></div>
      <h1 className="text-2xl font-semibold">Meetings</h1>
      {meetings && meetings.length === 0 && <div>No meeting found</div>}
      {isLoading && <div>Loading...</div>}
      <ul className="divide-y divide-gray-200">
        {meetings?.map((meeting) => (
          <li
            key={meeting.id}
            className="flex items-center justify-between gap-x-6 py-5"
          >
            <div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/meetings/${meeting.id}`}
                    className="text-sm font-semibold"
                  >
                    {meeting.name}
                  </Link>
                  {meeting.status === "PROCESSING" && (
                    <Badge className="bg-yellow-500 text-white">
                      Processing...
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-x-2 text-xs text-gray-500">
                <p className="whitespace-normal">
                  {meeting.createdAt.toLocaleDateString()}
                </p>
                <p className="truncate">{meeting.issues.length} issues</p>
              </div>
            </div>

            <div className="flex flex-none items-center gap-x-4">
              <Link href={`/meetings/${meeting.id}`}>
                <Button variant={"outline"} size={"sm"}>
                  View Meeting
                </Button>
              </Link>
              <Button
                disabled={deleteMeeting.isPending}
                onClick={() =>
                  deleteMeeting.mutate(
                    { meetingId: meeting.id },
                    {
                      onSuccess: () => {
                        toast.success("Meeting Deleted!");
                        refetch();
                      },
                    },
                  )
                }
                variant={"destructive"}
                size={"sm"}
              >
                <Trash2Icon className="ml-1 size-4" />
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default MeetingsPage;
