"use client";
import React from "react";
import Image from "next/image";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useProject } from "@/hooks/use-project";
import { askQuestion } from "@/lib/actions";
import { readStreamableValue } from "ai/rsc";
import CodeReferences from "../dashboard/_components/code-references";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { Bot, Save, Sparkles, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRefetch } from "@/hooks/use-refetch";

const AskQuestionCard = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { project } = useProject();
  const [question, setQuestion] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [filesReferences, setFilesReferences] = React.useState<
    { fileName: string; sourceCode: string; summary: string }[]
  >([]);
  const [answer, setAnswer] = React.useState("");
  const saveAnswer = api.project.saveAnswer.useMutation();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!question.trim()) {
      toast.error("Please enter a question");
      return;
    }
    if (!project?.id) return;

    setAnswer("");
    setFilesReferences([]);
    setLoading(true);

    try {
      const { output, filesReferences } = await askQuestion(
        question,
        project.id,
      );
      setIsOpen(true);
      setFilesReferences(filesReferences);

      for await (const delta of readStreamableValue(output)) {
        if (delta) {
          setAnswer((ans) => ans + delta);
        }
      }
    } catch (error) {
      toast.error("Failed to get answer");
    } finally {
      setLoading(false);
    }
  };

  const refetch = useRefetch();

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-h-[85vh] gap-0 p-0 sm:max-w-[800px]">
          <DialogHeader className="sticky top-0 z-10 border-b bg-background/80 px-6 py-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">AI Response</h2>
                  <p className="text-sm text-muted-foreground">
                    Based on your codebase analysis
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  disabled={saveAnswer.isPending}
                  onClick={() => {
                    saveAnswer.mutate(
                      {
                        projectId: project!.id,
                        question,
                        answer,
                        filesReferences,
                      },
                      {
                        onSuccess: () => {
                          toast.success("Answer Saved!");
                          refetch();
                          setIsOpen(false);
                        },
                        onError: () => {
                          toast.error("Failed to save answer");
                        },
                      },
                    );
                  }}
                  variant="outline"
                  size="sm"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Response
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(85vh-80px)] px-6 py-4">
            <div className="space-y-6">
              {/* {answer && (
                <div className="rounded-lg border bg-muted/50 p-4">
                  <MDEditor.Markdown
                    source={answer}
                    className="prose prose-sm dark:prose-invert max-w-none"
                  />
                </div>
              )} */}

              {filesReferences.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Referenced Files</h3>
                  <CodeReferences fileReferences={filesReferences} />
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Card className="relative col-span-3 overflow-hidden border-none bg-gradient-to-b from-muted/50 to-muted/20 shadow-md">
        <CardContent className="p-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-600/10 p-2">
                <Sparkles className="h-5 w-5 animate-pulse text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Ask AI Assistant</h2>
                <p className="text-sm text-muted-foreground">
                  Get instant answers about {project?.name}
                </p>
              </div>
            </div>

            <Textarea
              placeholder="Ask anything about your codebase..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-[100px] resize-none bg-background"
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={loading}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <Bot className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Bot className="mr-2 h-4 w-4" />
                    Ask Question
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default AskQuestionCard;
