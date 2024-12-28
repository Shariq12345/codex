import React from "react";
import IssuesList from "../_components/issues_list";

interface MeetingDetailsPageProps {
  params: Promise<[meetingId: string]>;
}

const MeetingDetailsPage = async ({ params }: MeetingDetailsPageProps) => {
  // @ts-ignore
  const { meetingId } = await params;
  return <IssuesList meetingId={meetingId} />;
};

export default MeetingDetailsPage;
