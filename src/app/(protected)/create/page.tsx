"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRefetch } from "@/hooks/use-refetch";

type FormInput = {
  repoUrl: string;
  projectName: string;
  githubToken?: string;
};

const CreatePage = () => {
  const { register, handleSubmit, reset } = useForm<FormInput>();
  const createProject = api.project.createProject.useMutation();
  const refetch = useRefetch();

  const onSubmit = (data: FormInput) => {
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
    return true;
  };

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
            <Input
              required
              {...register("projectName")}
              placeholder="Project Name"
            />
            <div className="h-2"></div>
            <Input
              required
              {...register("repoUrl")}
              placeholder="Repository URL"
              type="url"
            />
            <div className="h-2"></div>
            <Input {...register("githubToken")} placeholder="GitHub Token" />
            <div className="h-2"></div>
            <Button type="submit" disabled={createProject.isPending}>
              Create Project
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
