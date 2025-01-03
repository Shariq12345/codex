import { GoogleGenerativeAI } from "@google/generative-ai";
import { Document } from "@langchain/core/documents";

const genAI = new GoogleGenerativeAI("AIzaSyBDlm6DTIOaD0WdWcglL75j1GoO6cSckKU");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  retries = 3,
  initialDelay = 2000,
): Promise<T> => {
  let delay = initialDelay;

  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      if (i === retries - 1) throw error; // Last retry failed

      if (error?.status === 429) {
        console.log(
          `Rate limited, waiting ${delay}ms before retry ${i + 1}/${retries}`,
        );
        await wait(delay);
        delay *= 2; // Exponential backoff
        continue;
      }

      throw error; // Not a rate limit error
    }
  }

  throw new Error("Retry failed");
};

export const aiCommitSummary = async (diff: string) => {
  //https://github.com/owner/repo/commit/commitHash.diff
  const response = await model.generateContent([
    `
      You are an AI that analyzes Git commit diffs and provides concise, human-readable summaries of the changes made. Git diffs contain information about added, modified, or deleted lines in a file. Below is a description of the Git diff format and instructions for your task:
      ### Understanding Git Diff Format
      1. **File Information**:
         Each diff begins with the files being compared, indicated by lines like:
         \`\`\`
         --- a/<file_path>
         +++ b/<file_path>
         \`\`\`
         \`a/<file_path>\` represents the original file, and \`b/<file_path>\` represents the updated file.
      2. **Line Changes**:
         Changes are displayed with line numbers and modifications:
         - Lines beginning with \`+\` are **additions**.
         - Lines beginning with \`-\` are **deletions**.
         - Lines without prefixes are **context lines** for reference.
      3. **Hunks**:
         A "hunk" groups related changes in a file and begins with a line like:
         \`\`\`
         @@ -<old_start>,<old_count> +<new_start>,<new_count> @@
         \`\`\`
         This shows the line ranges in the original and updated files where changes occur.
      ### Your Task
      1. Read and understand the provided Git diff.
      2. Summarize the changes clearly and concisely, focusing on the following:
         - What was added, removed, or modified.
         - Which files were affected and their purpose, if clear.
         - Any patterns or significant context in the changes (e.g., bug fixes, feature additions, refactoring).
      3. Use the following structure for your summary:
         - **Files Changed**: List of affected files.
         - **Summary of Changes**: Briefly describe what was added, removed, or modified.
         - **Purpose or Context (if available)**: If the changes imply a clear goal (e.g., "fixing a bug" or "adding a feature"), state it.
      ### Example Input and Output
      **Input (Git diff)**:
      \`\`\`
      --- a/src/app.js
      +++ b/src/app.js
      @@ -12,7 +12,8 @@ function greet() {
      -    console.log("Hello, world!");
      +    const greeting = "Hello, world!";
      +    console.log(greeting);
      }
      --- a/src/util.js
      +++ b/src/util.js
      @@ -25,6 +25,8 @@ function add(a, b) {
           return a + b;
      }
      +function subtract(a, b) {
      +    return a - b;
      }
      \`\`\`
      **Output**:
      - **Files Changed**:
        - \`src/app.js\`
        - \`src/util.js\`
      - **Summary of Changes**:
        - \`src/app.js\`: Refactored the \`greet\` function to define a \`greeting\` variable before logging it to the console.
        - \`src/util.js\`: Added a new function \`subtract\` to calculate the difference between two numbers.
      - **Purpose or Context**: Improved readability in \`src/app.js\`. Added a subtraction utility to \`src/util.js\`.
      Provide your Git diff below, and I will summarize it for you.
      ### Git Diff
      ${diff}
    `,
  ]);

  return response.response.text();
};

export const summariseCode = async (doc: Document) => {
  console.log("Getting Summary For", doc.metadata.source);

  try {
    const code = doc.pageContent.slice(0, 10000);

    const response = await retryWithBackoff(async () => {
      return await model.generateContent([
        `You are an intelligent senior software engineer who specializes in onboarding junior developers to a codebase. Your task is to provide a concise summary of the code snippet below, highlighting key components, functions, and patterns. Your summary should help new developers understand the purpose and structure of the code. Use the following structure for your summary:`,
        `You are onboarding a junior software engineer and explaining to them the pupose of the ${doc.metadata.source} file.
        Here is the code:
        ---
        ${code}
        ---
        Give a summary in no more than 100 words of the code above.
        `,
      ]);
    });

    if (!response.response.text()) {
      console.error(`Empty response for ${doc.metadata.source}`);
      return `Code file ${doc.metadata.source}`;
    }

    return response.response.text();
  } catch (error) {
    console.error(`Error summarizing ${doc.metadata.source}:`, error);
    return `Code file ${doc.metadata.source}`; // Return basic description instead of empty string
  }
};

export async function generateEmbedding(summary: string) {
  const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

  return await retryWithBackoff(async () => {
    const result = await model.embedContent(summary);
    return result.embedding.values;
  });
}

// `You are an AI that summarizes Git commit diffs. Below is the Git diff format:
// ### Git Diff Format:
// 1. **File Info**:
//   \`--- a/<file_path>\` (original)
//   \`+++ b/<file_path>\` (updated)
// 2. **Changes**:
//   - \`+\`: Added line
//   - \`-\`: Deleted line
//   - Context lines have no prefix.
// ### Task:
// - **Files Changed**: List the affected files.
// - **Summary**: What was added, removed, or modified.
// - **Purpose**: Briefly describe the goal of the change (e.g., bug fix, feature).
// ---
// **Example Input**:
// \`\`\`
// --- a/src/app.js
// +++ b/src/app.js
// @@ -12,7 +12,8 @@ function greet() {
// -    console.log("Hello, world!");
// +    const greeting = "Hello, world!";
// +    console.log(greeting);
// }
// --- a/src/util.js
// +++ b/src/util.js
// @@ -25,6 +25,8 @@ function add(a, b) {
//     }
// +function subtract(a, b) {
// +    return a - b;
// }
// \`\`\`
// **Output**:
// - **Files Changed**:
//   - \`src/app.js\`
//   - \`src/util.js\`
// - **Summary**:
//   - \`src/app.js\`: Refactored the \`greet\` function to use a variable.
//   - \`src/util.js\`: Added \`subtract\` function.
// - **Purpose**: Improved readability and added a subtraction utility.
// ---
// Now, provide the Git diff for summarization.`,
