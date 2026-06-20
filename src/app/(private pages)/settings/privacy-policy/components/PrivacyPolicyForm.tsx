"use client";

import FormBuilder, { FieldConfig } from "@/dashboard/FormBuilder";
import { Button, Card, CardContent, CardHeader } from "@/dashboard/ui";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type PolicyValues = {
  title: string;
  description: string;
  content: string;
};

const empty: PolicyValues = { title: "", description: "", content: "" };

const fields: FieldConfig[] = [
  { name: "title", type: "text", required: true, label: "Page Title" },
  { name: "description", type: "textarea", required: true, label: "Description" },
  { name: "content", type: "richtext", required: true, label: "Content" },
];

export default function PrivacyPolicyForm() {
  const [docId, setDocId] = useState("");
  const [values, setValues] = useState<PolicyValues>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/privacy-policy-page", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data?.data) {
          setDocId(data.data._id || "");
          setValues({
            title: data.data.title || "",
            description: data.data.description || "",
            content: data.data.content || "",
          });
        }
      })
      .catch(() => toast.error("Failed to load privacy policy data"))
      .finally(() => setLoading(false));
  }, []);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!values.title.trim()) next.title = "Title is required";
    if (!values.description.trim()) next.description = "Description is required";
    if (!values.content.trim()) next.content = "Content is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const response = await fetch("/api/privacy-policy-page", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: docId, data: values }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Failed to save");
      toast.success("Privacy policy saved");
    } catch (error: any) {
      toast.error(error?.message || "Failed to save");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-zinc-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
            Privacy Policy
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Edit the privacy policy page title, description, and content.
          </p>
        </CardHeader>
        <CardContent>
          <div className="mb-4 rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
            SEO scoring is not applied to legal pages. Ensure content is accurate and up to date.
          </div>
          <form className="grid gap-5" onSubmit={handleSubmit}>
            <FormBuilder
              fields={fields}
              values={values}
              onChange={(name, value) =>
                setValues((prev) => ({ ...prev, [name]: value }))
              }
              errors={errors}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
