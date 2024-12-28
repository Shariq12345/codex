"use server";

import { streamText } from "ai";
import { createStreamableValue } from "ai/rsc";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateEmbedding } from "./gemini";
import { db } from "@/server/db";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function askQuestion(question: string, projectId: string) {
  const stream = createStreamableValue();

  const queryVector = await generateEmbedding(question);

  const vectorQuery = `[${queryVector.join(",")}]`;

  const result = (await db.$queryRaw`
  SELECT "fileName", "sourceCode", "summary",
  1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) AS similarity
  FROM "SourceCodeEmbedding" 
  WHERE 1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) > 0.5
  AND "projectId" = ${projectId}
  ORDER BY similarity DESC
  LIMIT 10
  `) as {
    fileName: string;
    sourceCode: string;
    summary: string;
  }[];

  let context = "";

  for (const doc of result) {
    context += `source: ${doc.fileName}\nCode Content: ${doc.sourceCode}\nSummary of the file: ${doc.summary}\n\n`;
  }

  (async () => {
    const { textStream } = await streamText({
      model: google("gemini-1.5-flash"),
      prompt: `
      You are a ai code assistant who answers questions about the codebase. Your target audience is a technical person who is looking for a quick answer to their question. You should provide a brief and concise answer to the question.
      The traits of AI include export knowledge, reasoning, problem-solving, perception, learning, planning, and natural language processing.
      You are a well-behaved, well-mannered, and polite AI that is always helpful and friendly.
      You have all the knowledge of the codebase and can answer any question related to the codebase.
      If the question is asking about a code or a specific file, you will provide the detailed answer, giving step by step instructions.
      START CONTEXT BLOCK
      ${context}
      END OF CONTEXT BLOCK

      START QUESTION
      ${question}
      END QUESTION
      You will take into account any CONTEXT BLOCK and provide the answer to the question.
      if the context does not provide the answer to the question, you will say, "I am sorry, I do not have the answer to your question."
      You will not apologize for the previous responses, but instead will indicate new information that you have learned.
      You will not invent information, but instead will provide the most accurate information you have.
      Provide the answers in markdown syntax, with code snippets if needed. Be as detailed and concise as pwossible when answering the question.
      `,
    });

    for await (const delta of textStream) {
      stream.update(delta);
    }

    stream.done();
  })();

  return {
    output: stream.value,
    filesReferences: result,
  };
}
