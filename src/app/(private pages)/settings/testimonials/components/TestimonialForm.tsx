"use client";

import FormBuilder, { FieldConfig } from "@/dashboard/FormBuilder";
import { Button, Card, CardContent, CardHeader } from "@/dashboard/ui";
import { useState } from "react";

export type TestimonialFormValues = {
  name: string;
  role: string;
  profile: string;
  profileAlt?: string;
  profileTitle?: string;
  review: string;
};

const testimonialFields: FieldConfig[] = [
  { name: "name", type: "text", required: true, label: "Client Name" },
  { name: "role", type: "text", required: true, label: "Role / Company" },
  { name: "profile", type: "image", required: true, label: "Photo" },
  { name: "review", type: "textarea", required: true, label: "Review" },
];

export const emptyTestimonialValues: TestimonialFormValues = {
  name: "",
  role: "",
  profile: "",
  profileAlt: "",
  profileTitle: "",
  review: "",
};

export default function TestimonialForm({
  title,
  description,
  initialValues = emptyTestimonialValues,
  submitting,
  onSubmit,
}: {
  title: string;
  description: string;
  initialValues?: TestimonialFormValues;
  submitting: boolean;
  onSubmit: (values: TestimonialFormValues) => Promise<void>;
}) {
  const [values, setValues] = useState<TestimonialFormValues>({
    ...emptyTestimonialValues,
    ...initialValues,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateValue = (name: string, value: any) => {
    setValues((current) => ({ ...current, [name]: value }));
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!values.name) nextErrors.name = "Name is required";
    if (!values.role) nextErrors.role = "Role is required";
    if (!values.profile) nextErrors.profile = "Photo is required";
    if (!values.review) nextErrors.review = "Review text is required";
    // if (!values.profileAlt) nextErrors.profile = "Alt text is required";
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
            fields={testimonialFields}
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
