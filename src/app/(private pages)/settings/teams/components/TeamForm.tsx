"use client";

import FormBuilder, { FieldConfig } from "@/dashboard/FormBuilder";
import { Button, Card, CardContent, CardHeader } from "@/dashboard/ui";
import { useState } from "react";

export type TeamFormValues = {
  name: string;
  role: string;
  profile: string;
  profileAlt?: string;
  profileTitle?: string;
  bio?: string;
  linkedin?: string;
};

const teamFields: FieldConfig[] = [
  { name: "name", type: "text", required: true, label: "Full Name" },
  { name: "role", type: "text", required: true, label: "Job Title" },
  { name: "profile", type: "image", required: true, label: "Photo" },
  { name: "bio", type: "textarea", label: "Short Bio", optional: true },
  { name: "linkedin", type: "url", label: "LinkedIn URL", optional: true },
];

export const emptyTeamValues: TeamFormValues = {
  name: "",
  role: "",
  profile: "",
  profileAlt: "",
  profileTitle: "",
  bio: "",
  linkedin: "",
};

export default function TeamForm({
  title,
  description,
  initialValues = emptyTeamValues,
  submitting,
  onSubmit,
}: {
  title: string;
  description: string;
  initialValues?: TeamFormValues;
  submitting: boolean;
  onSubmit: (values: TeamFormValues) => Promise<void>;
}) {
  const [values, setValues] = useState<TeamFormValues>({
    ...emptyTeamValues,
    ...initialValues,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateValue = (name: string, value: any) => {
    setValues((current) => ({ ...current, [name]: value }));
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!values.name) nextErrors.name = "Name is required";
    if (!values.role) nextErrors.role = "Job title is required";
    if (!values.profile) nextErrors.profile = "Photo is required";
    if (!values.profileAlt) nextErrors.profile = "Alt text is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  return (
    <Card>
      <CardHeader>
        <h1 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
          {title}
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {description}
        </p>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-5"
          onSubmit={async (event) => {
            event.preventDefault();
            if (!validate()) return;
            await onSubmit(values);
          }}
        >
          <FormBuilder
            fields={teamFields}
            values={values}
            onChange={updateValue}
            errors={errors}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
