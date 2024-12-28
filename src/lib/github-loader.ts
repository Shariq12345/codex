import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import { Document } from "@langchain/core/documents";
import { generateEmbedding, summariseCode } from "./gemini";
import { db } from "@/server/db";

export const loadGithubRepo = async (
  githubUrl: string,
  githubToken?: string,
) => {
  const loader = new GithubRepoLoader(githubUrl, {
    accessToken: githubToken || "",
    branch: "main",
    ignoreFiles: [
      "package.json",
      "package-lock.json",
      "yarn.lock",
      "pnpm-lock.yaml",
      "bun.lockb", // Fixed typo from bun-lockb
      // Consider adding more common files to ignore:
      "node_modules/**/*",
      ".git/**/*",
      ".env*",
      "dist/**/*",
      "build/**/*",
    ],
    recursive: true,
    unknown: "warn",
    maxConcurrency: 5,
  });

  const doc = await loader.load();

  return doc;
};

export const indexGithubRepo = async (
  projectId: string,
  githubUrl: string,
  githubToken?: string,
) => {
  const docs = await loadGithubRepo(githubUrl, githubToken);
  console.log(`Found ${docs.length} files to process`);

  const allEmbeddings = await generateEmbeddings(docs);
  console.log(
    `Successfully processed ${allEmbeddings.length} of ${docs.length} files`,
  );

  let processed = 0;
  await Promise.allSettled(
    allEmbeddings.map(async (embedding, index) => {
      if (!embedding) return;

      try {
        const sourceCodeEmbedding = await db.sourceCodeEmbedding.create({
          data: {
            projectId,
            summary: embedding.summary,
            sourceCode: embedding.sourceCode,
            fileName: embedding.fileName,
          },
        });

        await db.$executeRaw`UPDATE "SourceCodeEmbedding" SET "summaryEmbedding" = ${embedding.embedding}::vector WHERE "id" = ${sourceCodeEmbedding.id}`;

        processed++;
        console.log(
          `Saved ${processed} of ${allEmbeddings.length} to database`,
        );
      } catch (error) {
        console.error(
          `Failed to save ${embedding.fileName} to database:`,
          error,
        );
      }
    }),
  );
};

const generateEmbeddings = async (docs: Document[]) => {
  const results = [];
  const batchSize = 2; // Reduced batch size

  for (let i = 0; i < docs.length; i += batchSize) {
    console.log(
      `Processing batch ${i / batchSize + 1} of ${Math.ceil(docs.length / batchSize)}`,
    );

    const batch = docs.slice(i, i + batchSize);
    const batchPromises = batch.map(async (doc) => {
      try {
        const summary = await summariseCode(doc);
        const embedding = await generateEmbedding(summary);

        return {
          summary,
          embedding,
          sourceCode: JSON.parse(JSON.stringify(doc.pageContent)),
          fileName: doc.metadata.source,
        };
      } catch (error) {
        console.error(`Failed to process ${doc.metadata.source}:`, error);
        return null;
      }
    });

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults.filter(Boolean));

    // Increased delay between batches
    if (i + batchSize < docs.length) {
      console.log("Waiting between batches...");
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Increased to 5 seconds
    }
  }

  return results;
};
