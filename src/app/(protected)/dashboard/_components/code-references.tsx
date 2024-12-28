import React, { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "@/lib/utils";
import { FileIcon, FileTextIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  fileReferences: {
    fileName: string;
    sourceCode: string;
    summary: string;
  }[];
}

const CodeReferences = ({ fileReferences }: Props) => {
  const [tab, setTab] = useState(fileReferences[0]?.fileName);

  if (fileReferences.length === 0) return null;

  return (
    <div className="flex h-[500px] flex-col overflow-hidden rounded-lg border bg-zinc-950">
      {/* File Tabs */}
      <div className="sticky top-0 z-10 border-b bg-zinc-900/50 px-4 pt-4 backdrop-blur">
        <ScrollArea className="pb-3">
          <div className="flex gap-2">
            {fileReferences.map((file) => (
              <button
                onClick={() => setTab(file.fileName)}
                key={file.fileName}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-zinc-800/50",
                  {
                    "bg-zinc-800 text-white": tab === file.fileName,
                    "text-zinc-400": tab !== file.fileName,
                  },
                )}
              >
                <FileIcon className="h-4 w-4 shrink-0" />
                <span className="max-w-[150px] truncate">
                  {file.fileName.split("/").pop()}
                </span>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* File Content */}
      <Tabs
        value={tab}
        onValueChange={setTab}
        className="flex h-full min-h-0 flex-col"
      >
        {fileReferences.map((file) => (
          <TabsContent
            key={file.fileName}
            value={file.fileName}
            className="flex h-full flex-col data-[state=active]:flex"
          >
            {/* File Summary */}
            <div className="border-b border-zinc-800/50 bg-zinc-900/30 px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <FileTextIcon className="h-4 w-4 shrink-0" />
                <span className="font-medium">Summary</span>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-300">
                {file.summary}
              </p>
            </div>

            {/* Code Block */}
            <div className="min-h-0 flex-1">
              <ScrollArea className="h-full">
                <div className="p-4">
                  <SyntaxHighlighter
                    language="typescript"
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      padding: "1rem",
                      borderRadius: "0.5rem",
                      background: "rgba(0, 0, 0, 0.2)",
                    }}
                    codeTagProps={{
                      style: {
                        fontSize: "13px",
                        lineHeight: "20px",
                        fontFamily: "var(--font-mono)",
                      },
                    }}
                    wrapLines={true}
                    wrapLongLines={true}
                  >
                    {file.sourceCode}
                  </SyntaxHighlighter>
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default CodeReferences;
