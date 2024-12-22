import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyBDlm6DTIOaD0WdWcglL75j1GoO6cSckKU");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

// console.log(
//   await summariseCommit(`
//       diff --git a/app/robots.ts b/app/robots.ts
//       index ec488c6..7384e6d 100644
//       --- a/app/robots.ts
//       +++ b/app/robots.ts
//       @@ -7,6 +7,6 @@ export default function robots(): MetadataRoute.Robots {
//            allow: "/",
//            disallow: "/private/",
//          },
//       -    sitemap: \`\${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml\`,
//       +    sitemap: \`https://www.askstudio.agency/sitemap.xml/sitemap.xml\`,
//        };
//      }
//     `),
// );
