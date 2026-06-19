"use client";

import { useEffect, useMemo, useState } from "react";
import ImageUploader from "./ImageUploader";
import RichTextEditor from "./RichTextEditor";
import SlugInput from "./SlugInput";
import { Badge, Button, Card, CardContent, CardHeader } from "./ui";

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "toggle"
  | "select"
  | "slug"
  | "image"
  | "richtext"
  | "relation"
  | "tags"
  | "url"
  | "date";

export interface FieldConfig {
  name: string;
  type: FieldType;
  label: string;
  required?: boolean;
  optional?: boolean;
  group?: string;
  maxLength?: number;
  source?: string;
  options?: { label: string; value: string }[];
  collection?: string;
  default?: any;
}

interface FormBuilderProps {
  fields: FieldConfig[];
  values: Record<string, any>;
  onChange: (name: string, value: any) => void;
  errors?: Record<string, string>;
}

type RemoteOption = {
  label: string;
  value: string;
  slug?: string;
};

const inputClass =
  "min-h-11 rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950";

const getCollectionItems = (collection: string, data: any) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.[collection])) return data[collection];
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.tags)) return data.tags;
  if (Array.isArray(data?.categories)) return data.categories;
  if (Array.isArray(data?.teamData)) return data.teamData;
  return [];
};

const toRemoteOption = (item: any): RemoteOption => ({
  label: item.name || item.title || item.label || item.slug || item._id,
  value: item.id || item._id || item.slug || item.name,
  slug: item.slug,
});

export default function FormBuilder({
  fields,
  values,
  onChange,
  errors = {},
}: FormBuilderProps) {
  const [remoteOptions, setRemoteOptions] = useState<Record<string, RemoteOption[]>>({});
  const [tagInput, setTagInput] = useState("");

  const collections = useMemo(
    () =>
      Array.from(
        new Set(
          fields
            .filter((field) => field.collection || field.type === "tags")
            .map((field) => field.collection || "tags")
        )
      ),
    [fields]
  );

  useEffect(() => {
    collections.forEach(async (collection) => {
      try {
        const response = await fetch(`/api/${collection}`, {
          credentials: "include",
        });
        const data = await response.json();
        if (!response.ok) return;

        setRemoteOptions((current) => ({
          ...current,
          [collection]: getCollectionItems(collection, data).map(toRemoteOption),
        }));
      } catch {
        // FormBuilder leaves relation fields empty if an optional collection cannot load.
      }
    });
  }, [collections]);

  const mainFields = fields.filter((field) => !field.optional && !field.group);
  const optionalFields = fields.filter((field) => field.optional && !field.group);
  const groupedFields = fields.filter((field) => field.group);
  const groups = Array.from(new Set(groupedFields.map((field) => field.group || "")));

  const renderCounter = (field: FieldConfig) => {
    if (!field.maxLength) return null;
    return (
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        {String(values[field.name] || "").length}/{field.maxLength}
      </p>
    );
  };

  const renderField = (field: FieldConfig) => {
    const value = values[field.name] ?? field.default ?? "";
    const error = errors[field.name];

    const sharedLabel = (
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm font-medium">
          {field.label}
          {field.required && <span className="text-red-500"> *</span>}
        </label>
        {renderCounter(field)}
      </div>
    );

    let control: React.ReactNode;

    if (field.type === "textarea") {
      control = (
        <textarea
          required={field.required}
          value={value}
          maxLength={field.maxLength}
          onChange={(event) => onChange(field.name, event.target.value)}
          className={`${inputClass} min-h-28 py-3`}
        />
      );
    } else if (field.type === "number") {
      control = (
        <input
          required={field.required}
          type="number"
          value={value}
          onChange={(event) => onChange(field.name, Number(event.target.value))}
          className={inputClass}
        />
      );
    } else if (field.type === "toggle") {
      control = (
        <button
          type="button"
          onClick={() => onChange(field.name, !value)}
          className={`h-6 w-11 rounded-full p-1 transition ${
            value ? "bg-zinc-950 dark:bg-zinc-50" : "bg-zinc-300 dark:bg-zinc-800"
          }`}
        >
          <span
            className={`block h-4 w-4 rounded-full bg-white transition dark:bg-zinc-950 ${
              value ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      );
    } else if (field.type === "select" || field.type === "relation") {
      const options =
        field.type === "relation"
          ? remoteOptions[field.collection || ""] || []
          : field.options || [];

      control = (
        <select
          required={field.required}
          value={value}
          onChange={(event) => onChange(field.name, event.target.value)}
          className={inputClass}
        >
          <option value="">Select...</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    } else if (field.type === "slug") {
      control = (
        <SlugInput
          value={value}
          onChange={(nextValue) => onChange(field.name, nextValue)}
          sourceValue={String(values[field.source || ""] || "")}
        />
      );
    } else if (field.type === "image") {
      control = (
        <ImageUploader
          value={value}
          onChange={(nextValue) => onChange(field.name, nextValue)}
          altText={values[`${field.name}Alt`] || values.name || ""}
          onAltTextChange={(nextValue) => onChange(`${field.name}Alt`, nextValue)}
          titleText={values[`${field.name}Title`] || ""}
          onTitleTextChange={(nextValue) => onChange(`${field.name}Title`, nextValue)}
        />
      );
    } else if (field.type === "richtext") {
      control = (
        <RichTextEditor
          value={value}
          onChange={(nextValue) => onChange(field.name, nextValue)}
        />
      );
    } else if (field.type === "tags") {
      const selectedTags = Array.isArray(value) ? value : [];
      const options = remoteOptions[field.collection || "tags"] || [];
      const inputMatch = options.find(
        (option) => option.label.toLowerCase() === tagInput.toLowerCase()
      );

      control = (
        <div className="grid gap-2">
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag: string) => (
              <Badge key={tag}>
                {tag}
                <button
                  type="button"
                  className="ml-2"
                  onClick={() =>
                    onChange(
                      field.name,
                      selectedTags.filter((item: string) => item !== tag)
                    )
                  }
                >
                  x
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={(event) => setTagInput(event.target.value)}
              className={inputClass}
              list={`${field.name}-options`}
            />
            <datalist id={`${field.name}-options`}>
              {options.map((option) => (
                <option key={option.value} value={option.label} />
              ))}
            </datalist>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                const nextTag = inputMatch?.value || tagInput.trim();
                if (!nextTag || selectedTags.includes(nextTag)) return;
                onChange(field.name, [...selectedTags, nextTag]);
                setTagInput("");
              }}
            >
              Add
            </Button>
          </div>
        </div>
      );
    } else {
      control = (
        <input
          required={field.required}
          type={field.type === "date" ? "date" : field.type === "url" ? "url" : "text"}
          value={value}
          maxLength={field.maxLength}
          onChange={(event) => onChange(field.name, event.target.value)}
          className={inputClass}
        />
      );
    }

    return (
      <div key={field.name} className="grid gap-2">
        {field.type !== "slug" && sharedLabel}
        {control}
        {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
      </div>
    );
  };

  return (
    <div className="grid gap-5">
      {mainFields.map(renderField)}

      {optionalFields.length > 0 && (
        <details className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <summary className="cursor-pointer px-4 py-3 text-sm font-semibold">
            Advanced Options
          </summary>
          <div className="grid gap-5 border-t border-zinc-200 p-4 dark:border-zinc-800">
            {optionalFields.map(renderField)}
          </div>
        </details>
      )}

      {groups.map((group) => (
        <Card key={group}>
          <CardHeader>
            <details>
              <summary className="cursor-pointer text-sm font-semibold">
                {group} Settings
              </summary>
              <CardContent className="grid gap-5 px-0 pb-0 pt-4">
                {groupedFields
                  .filter((field) => field.group === group)
                  .map(renderField)}
              </CardContent>
            </details>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
