"use client";
import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useProject } from "@/hooks/use-project";
import { api } from "@/trpc/react";
import AskQuestionCard from "./ask-question-card";
import MDEditor from "@uiw/react-md-editor";
import CodeReferences from "../dashboard/_components/code-references";
import { MessageCircle, Clock, ChevronRight, FileText } from "lucide-react";

const QAPage = () => {
  const { projectId } = useProject();
  const { data: questions } = api.project.getQuestions.useQuery({ projectId });
  const [isOpen, setIsOpen] = useState(false);

  const [questionIndex, setQuestionIndex] = useState(0);
  const question = questions?.[questionIndex];
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <AskQuestionCard />

      <div className="mt-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              Saved Questions
            </h1>
            <p className="text-sm text-muted-foreground">
              Your previous questions and AI responses
            </p>
          </div>
          <div className="rounded-md bg-muted px-2 py-1 text-sm text-muted-foreground">
            {questions?.length || 0} questions
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {questions?.map((question, index) => (
            <SheetTrigger
              key={question.id}
              onClick={() => setQuestionIndex(index)}
              className="w-full"
            >
              <div className="group relative overflow-hidden rounded-lg border bg-card p-4 transition-all hover:border-primary/20 hover:shadow-md">
                {/* Question Header */}
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <img
                        src={question.user.imageUrl ?? ""}
                        alt="User"
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <div className="absolute -bottom-1 -right-1 rounded-full bg-primary/10 p-0.5">
                        <MessageCircle className="h-3 w-3 text-primary" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <time dateTime={question.createdAt.toISOString()}>
                        {question.createdAt.toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </time>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </div>

                {/* Question Content */}
                <div className="space-y-2">
                  <h3 className="line-clamp-2 text-left text-sm font-medium leading-snug">
                    {question.question}
                  </h3>
                  <p className="line-clamp-2 text-left text-xs text-muted-foreground">
                    {question.answer}
                  </p>
                </div>

                {/* Files Badge */}
                {/* @ts-ignore */}
                {question.filesReferences?.length > 0 && (
                  <div className="mt-3 flex items-center gap-1.5">
                    <div className="flex items-center gap-1 rounded-md bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground">
                      <FileText className="h-3 w-3" />
                      {/* @ts-ignore */}
                      {question.filesReferences.length} file
                      {/* @ts-ignore */}
                      {question.filesReferences.length === 1 ? "" : "s"}
                    </div>
                  </div>
                )}
              </div>
            </SheetTrigger>
          ))}
        </div>
      </div>

      {question && (
        <SheetContent className="sm:max-w-[50vw]">
          <SheetHeader>
            <SheetTitle>{question.question}</SheetTitle>
            {/* <MDEditor.Markdown source={question.answer} /> */}
            <CodeReferences
              fileReferences={question.filesReferences ?? ([] as any)}
            />
          </SheetHeader>
        </SheetContent>
      )}
    </Sheet>
  );
};

export default QAPage;
