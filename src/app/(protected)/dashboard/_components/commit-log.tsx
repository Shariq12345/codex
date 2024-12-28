"use client";
import { useProject } from "@/hooks/use-project";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import {
  ExternalLinkIcon,
  GitCommitHorizontal,
  FileText,
  Plus,
  Minus,
  Clock,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import ReactMarkdown from "react-markdown";
import { Badge } from "@/components/ui/badge";

const extractFiles = (summary: string): string[] => {
  if (!summary) return [];

  try {
    // Match the **Files Changed** section and capture file entries
    const match = summary.match(/\*\*Files Changed\*\*:\s*((?:- `.*?`\s*)+)/s);
    if (!match || !match[1]) return [];

    // Extract individual file paths from the matched block
    return match[1]
      .split("\n") // Split the block into lines
      .map((line) => line.trim()) // Trim each line
      .filter((line) => line.startsWith("-")) // Only process lines starting with `-`
      .map((line) => {
        const fileMatch = line.match(/`([^`]+)`/); // Extract the file path inside backticks
        return fileMatch && fileMatch[1] ? fileMatch[1] : null;
      })
      .filter((filePath): filePath is string => Boolean(filePath)); // Remove null or invalid values
  } catch (error) {
    console.error("Error parsing files:", error);
    return [];
  }
};

const CommitLog = () => {
  const { projectId, project } = useProject();
  const { data: commits } = api.project.getCommits.useQuery({ projectId });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Commit History</h2>
        <Badge variant="outline" className="px-3 py-1">
          <GitCommitHorizontal className="mr-2 h-4 w-4" />
          {commits?.length} commits
        </Badge>
      </div>

      <ul className="space-y-6">
        {commits?.map((commit, commitIndex) => {
          const filesChanged = extractFiles(commit.summary);
          return (
            <li key={commit.id} className="group relative">
              <div className="flex gap-x-4">
                {/* Timeline */}
                <div className="relative">
                  <div
                    className={cn(
                      commitIndex === commits.length - 1 ? "h-6" : "h-full",
                      "absolute left-5 top-0 w-0.5 bg-gray-200 transition-colors group-hover:bg-blue-200",
                    )}
                  />
                  <Image
                    src={commit.commitAuthorAvatar}
                    alt={`${commit.commitAuthor}'s avatar`}
                    className="relative mt-3 h-10 w-10 rounded-full shadow-sm ring-2 ring-white transition-transform group-hover:scale-105"
                    height={40}
                    width={40}
                  />
                </div>

                {/* Commit Content */}
                <div className="flex-1">
                  <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-200 transition-all hover:ring-blue-200">
                    {/* Header */}
                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {commit.commitAuthor}
                        </span>
                        <span className="text-sm text-gray-500">committed</span>
                        <Badge variant="secondary" className="hidden sm:flex">
                          {commit.commitHash.slice(0, 7)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          <Clock className="mr-1 h-3 w-3" />
                          {commit?.commitDate.toLocaleString()}
                        </Badge>
                        <Link
                          target="_blank"
                          href={`${project?.githubUrl}/commit/${commit.commitHash}`}
                          className="inline-flex items-center text-sm text-blue-500 transition-colors hover:text-blue-600"
                        >
                          <span className="hidden sm:inline">View Commit</span>
                          <ExternalLinkIcon className="ml-1 h-4 w-4" />
                        </Link>
                      </div>
                    </div>

                    {/* Commit Message */}
                    <div className="group mt-3">
                      <h3 className="text-sm font-semibold text-gray-800 transition-colors group-hover:text-blue-600">
                        {commit.commitMessage}
                      </h3>
                    </div>

                    {/* Commit Stats */}
                    <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-500">
                      <span className="inline-flex items-center">
                        <FileText className="mr-1 h-4 w-4" />
                        {/* {files.length} {files.length === 1 ? "file" : "files"}{" "}
                        changed */}
                        {`${filesChanged.length} files changed`}
                      </span>
                      {/* <span className="inline-flex items-center text-green-600">
                        <Plus className="mr-1 h-4 w-4" />
                        24
                      </span>
                      <span className="inline-flex items-center text-red-600">
                        <Minus className="mr-1 h-4 w-4" />
                        12
                      </span> */}
                    </div>

                    {/* Markdown Summary */}
                    <div className="mt-4">
                      <ReactMarkdown
                        className="space-y-2 text-sm text-gray-600"
                        components={{
                          p: ({ node, ...props }) => (
                            <p className="leading-relaxed" {...props} />
                          ),
                          a: ({ node, ...props }) => (
                            <a
                              className="text-blue-500 transition-colors hover:text-blue-600 hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                              {...props}
                            />
                          ),
                          ul: ({ node, ...props }) => (
                            <ul className="space-y-1 pl-4" {...props} />
                          ),
                          li: ({ node, ...props }) => (
                            <li className="list-none" {...props} />
                          ),
                          ol: ({ node, ...props }) => (
                            <ol className="space-y-1 pl-4" {...props} />
                          ),
                          code: ({ node, ...props }) => (
                            <code
                              className="rounded bg-gray-50 px-1.5 py-0.5 font-mono text-xs text-gray-800"
                              {...props}
                            />
                          ),
                          pre: ({ node, ...props }) => (
                            <pre
                              className="my-2 overflow-x-auto rounded-lg bg-gray-50 p-3"
                              {...props}
                            />
                          ),
                          h1: ({ node, ...props }) => (
                            <h1
                              className="mb-2 mt-4 text-lg font-semibold text-gray-900"
                              {...props}
                            />
                          ),
                          h2: ({ node, ...props }) => (
                            <h2
                              className="mb-2 mt-3 text-base font-semibold text-gray-900"
                              {...props}
                            />
                          ),
                        }}
                      >
                        {commit.summary}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CommitLog;
