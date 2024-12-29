"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRefetch } from "@/hooks/use-refetch";
import { Folder, Globe2, InfoIcon, KeySquare } from "lucide-react";

type FormInput = {
  repoUrl: string;
  projectName: string;
  githubToken?: string;
};

const CreatePage = () => {
  const { register, handleSubmit, reset } = useForm<FormInput>();
  const createProject = api.project.createProject.useMutation();
  const checkCredits = api.project.checkCredits.useMutation();

  const refetch = useRefetch();

  const onSubmit = (data: FormInput) => {
    if (!!checkCredits.data) {
      createProject.mutate(
        {
          name: data.projectName,
          githubUrl: data.repoUrl,
          githubToken: data.githubToken,
        },
        {
          onSuccess: () => {
            toast.success("Project created successfully");
            refetch();
          },
          onError: () => {
            toast.error("Failed to create project");
          },
        },
      );
    } else {
      checkCredits.mutate({
        githubUrl: data.repoUrl,
        githubToken: data.githubToken,
      });
    }

    reset();
  };

  const hasEnoughCredits = checkCredits?.data?.userCredits
    ? checkCredits.data.fileCount <= checkCredits.data.userCredits
    : true;

  return (
    <div className="flex h-full items-center justify-center gap-12">
      <img
        src="/undraw_programmer_1tdi.svg"
        alt="Create Project"
        className="h-56 w-auto"
      />
      <div>
        <div>
          <h1 className="text-2xl font-semibold">
            Link your GithHub Repository
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter the URL of your GitHub repository to link it to your account.
          </p>
        </div>
        <div className="h-4"></div>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                {/* Icon for Project Name */}
                <Folder className="size-4" />
              </span>
              <Input
                required
                {...register("projectName")}
                placeholder="Project Name"
                className="pl-10"
              />
            </div>

            <div className="h-2"></div>

            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                {/* Icon for Project Name */}
                <Globe2 className="size-4" />
              </span>
              <Input
                required
                {...register("repoUrl")}
                placeholder="Repository URL"
                type="url"
                className="pl-10"
              />
            </div>

            <div className="h-2"></div>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                {/* Icon for Project Name */}
                <KeySquare className="size-4" />
              </span>
              <Input
                {...register("githubToken")}
                placeholder="GitHub Token (Optional - Private Repos)"
                className="pl-10"
              />
            </div>
            {!!checkCredits.data && (
              <>
                <div className="mt-4 rounded-md border border-orange-200 bg-orange-50 px-4 py-2 text-orange-700">
                  <div className="flex items-center gap-2">
                    <InfoIcon className="size-4" />
                    <p className="text-sm">
                      You will be charged{" "}
                      <strong>{checkCredits.data?.fileCount}</strong> credits
                      for this project.
                    </p>
                  </div>
                  <p className="ml-6 text-sm text-violet-600">
                    You have <strong>{checkCredits.data?.userCredits}</strong>{" "}
                    credits remaining.
                  </p>
                </div>
              </>
            )}
            <div className="h-2"></div>
            <Button
              type="submit"
              disabled={
                createProject.isPending ||
                !!checkCredits.isPending ||
                !hasEnoughCredits
              }
              className="bg-violet-600 hover:bg-violet-700"
            >
              {!!checkCredits.data ? "Create Project" : "Check Credits"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
