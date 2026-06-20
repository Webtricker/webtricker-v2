"use client";

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import FormBuilder, { FieldConfig } from "@/dashboard/FormBuilder";
import { Badge, Button, Card, CardContent, Skeleton } from "@/dashboard/ui";
import {
  useGetHomePageDataQuery,
  useUpdateHomePageDataMutation,
} from "@/redux/features/pageData/pageData";
import { HomePageBlock, IHomePage } from "@/types/pageTypes";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FiChevronDown, FiChevronRight, FiEye, FiEyeOff, FiMoreVertical, FiPlus, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";

const inputClass =
  "min-h-11 rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950";

const collectionLinks: Record<string, { label: string; href: string }> = {
  testimonials: { label: "Testimonials", href: "/settings/testimonials" },
  services: { label: "Services", href: "/settings/services" },
  portfolios: { label: "Portfolio", href: "/settings/portfolios" },
  leader: { label: "Leaders", href: "/settings/leader" },
  teams: { label: "Team Members", href: "/settings/teams" },
  posts: { label: "Blog Posts", href: "/settings/blogs" },
};

const blockLabels: Record<string, string> = {
  hero: "Hero Banner",
  mediaIntro: "Intro Media",
  logoMarquee: "Client Logo Marquee",
  testimonialSlider: "Testimonials Slider",
  technologyGrid: "Technology Grid",
  marquee: "Large Marquee",
  portfolioShowcase: "Portfolio Showcase",
  portfolioSlider: "Portfolio Slider",
  leaderGrid: "Leaders Grid",
  teamSlider: "Team Slider",
  imageFeed: "Image Feed",
};

type Props = {
  testimonials?: unknown[];
  serviceData?: unknown[];
  posts?: unknown[] | null;
};

type SortableBlockProps = {
  section: HomePageBlock;
  expanded: boolean;
  onToggleExpanded: () => void;
  onToggleVisible: () => void;
  onFieldChange: (name: string, value: any) => void;
  onArrayChange: (name: string, value: any[]) => void;
};

const getByPath = (source: Record<string, any>, path: string) =>
  path.split(".").reduce((value, key) => value?.[key], source);

const setByPath = (source: Record<string, any>, path: string, value: any) => {
  const clone = { ...source };
  const keys = path.split(".");
  let cursor = clone;

  keys.slice(0, -1).forEach((key) => {
    cursor[key] = { ...(cursor[key] || {}) };
    cursor = cursor[key];
  });

  cursor[keys[keys.length - 1]] = value;
  return clone;
};

const getFormValues = (data: Record<string, any>, fields: FieldConfig[]) =>
  fields.reduce<Record<string, any>>((values, field) => {
    values[field.name] = getByPath(data, field.name);
    return values;
  }, {});

const normalizeSections = (homeData?: IHomePage): HomePageBlock[] =>
  [...(homeData?.sections || [])]
    .sort((a, b) => a.order - b.order)
    .map((section, index) => ({ ...section, order: (index + 1) * 10 }));

const getFriendlyLabel = (section: HomePageBlock) => {
  if (section.type === "collectionPreview") {
    if (section.data?.variant === "latestBlogs") return "Latest Blog Posts";
    if (section.data?.variant === "homeServices") return "Services Preview";
  }

  return blockLabels[section.type] || section.type;
};

const getFields = (section: HomePageBlock): FieldConfig[] => {
  switch (section.type) {
    case "hero":
      return [
        { name: "greeting.top", label: "Greeting top", type: "text", required: true },
        { name: "greeting.bottom", label: "Greeting bottom", type: "text", required: true },
        { name: "bannerText.top", label: "Large text top", type: "text", required: true },
        { name: "bannerText.left", label: "Large text left", type: "text", required: true },
        { name: "bannerText.right", label: "Large text right", type: "text", required: true },
        { name: "bannerDescription", label: "Description", type: "textarea", required: true },
        { name: "bannerSpinningIconWhite", label: "Spinning icon white URL", type: "url" },
        { name: "bannerSpinningIconBlack", label: "Spinning icon black URL", type: "url" },
        { name: "bannerVideo.type", label: "Hero media type", type: "select", options: [{ label: "Image", value: "image" }, { label: "Video", value: "video" }] },
        { name: "bannerVideo.src", label: "Hero media URL", type: "url", required: true },
        { name: "cta.label", label: "CTA label", type: "text" },
        { name: "cta.href", label: "CTA link", type: "text" },
      ];
    case "mediaIntro":
      return [
        { name: "introVideo.type", label: "Intro media type", type: "select", options: [{ label: "Image", value: "image" }, { label: "Video", value: "video" }] },
        { name: "introVideo.src", label: "Intro media URL", type: "url", required: true },
      ];
    case "logoMarquee":
      return [{ name: "title", label: "Section title", type: "text", required: true }];
    case "testimonialSlider":
      return [{ name: "sectionBg", label: "Background image URL", type: "url" }];
    case "collectionPreview":
      return section.data?.variant === "latestBlogs"
        ? [
            { name: "blogSectionTitle.large", label: "Title large", type: "text" },
            { name: "blogSectionTitle.medium", label: "Title medium", type: "text" },
            { name: "blogSectionTitle.small", label: "Title small", type: "text" },
          ]
        : [
            { name: "serviceSectionTitle.large", label: "Title large", type: "text" },
            { name: "serviceSectionTitle.medium", label: "Title medium", type: "text" },
            { name: "serviceSectionTitle.small", label: "Title small", type: "text" },
            { name: "allServiceBtnText", label: "Button text", type: "text" },
            { name: "href", label: "Button link", type: "text" },
          ];
    case "portfolioSlider":
      return [
        { name: "linkText", label: "Button text", type: "text" },
        { name: "href", label: "Button link", type: "text" },
      ];
    case "leaderGrid":
    case "teamSlider":
      return [{ name: "title", label: "Section title", type: "text" }];
    default:
      return [];
  }
};

const getCollectionNote = (section: HomePageBlock) => {
  const collection =
    section.data?.collection ||
    (section.type === "testimonialSlider" && "testimonials") ||
    (section.type === "portfolioShowcase" && "portfolios") ||
    (section.type === "portfolioSlider" && "portfolios");
  if (!collection) return null;
  const target = collectionLinks[collection];
  if (!target) return null;

  return (
    <div className="rounded-md border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900 dark:border-sky-900/50 dark:bg-sky-950/40 dark:text-sky-100">
      Content pulled automatically from {target.label}. Manage items in{" "}
      <Link className="font-semibold underline" href={target.href}>
        {target.label}
      </Link>
      .
    </div>
  );
};

function RepeatableStringEditor({
  label,
  values,
  onChange,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
}) {
  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between gap-3">
        <h4 className="text-sm font-semibold">{label}</h4>
        <Button type="button" variant="secondary" onClick={() => onChange([...values, ""])}>
          <FiPlus /> Add
        </Button>
      </div>
      <div className="grid gap-2">
        {values.map((value, index) => (
          <div key={index} className="flex gap-2">
            <input
              value={value}
              onChange={(event) =>
                onChange(values.map((item, itemIndex) => (itemIndex === index ? event.target.value : item)))
              }
              className={`${inputClass} flex-1`}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))}
              aria-label={`Remove ${label} item`}
            >
              <FiTrash2 />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function TechnologyEditor({
  values,
  onChange,
}: {
  values: { icon: string; name: string }[];
  onChange: (values: { icon: string; name: string }[]) => void;
}) {
  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between gap-3">
        <h4 className="text-sm font-semibold">Technologies</h4>
        <Button type="button" variant="secondary" onClick={() => onChange([...values, { icon: "", name: "" }])}>
          <FiPlus /> Add
        </Button>
      </div>
      <div className="grid gap-3">
        {values.map((item, index) => (
          <div key={index} className="grid gap-2 rounded-md border border-zinc-200 p-3 dark:border-zinc-800 md:grid-cols-[1fr_1fr_auto]">
            <input
              aria-label="Technology icon URL"
              value={item.icon}
              onChange={(event) =>
                onChange(values.map((value, itemIndex) => (itemIndex === index ? { ...value, icon: event.target.value } : value)))
              }
              className={inputClass}
              placeholder="Icon URL"
            />
            <input
              aria-label="Technology name"
              value={item.name}
              onChange={(event) =>
                onChange(values.map((value, itemIndex) => (itemIndex === index ? { ...value, name: event.target.value } : value)))
              }
              className={inputClass}
              placeholder="Name"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))}
              aria-label="Remove technology"
            >
              <FiTrash2 />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SortableBlock({
  section,
  expanded,
  onToggleExpanded,
  onToggleVisible,
  onFieldChange,
  onArrayChange,
}: SortableBlockProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: section.id });
  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0) scaleX(${transform.scaleX}) scaleY(${transform.scaleY})`
      : undefined,
    transition,
  };
  const fields = getFields(section);

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        className={`transition ${!section.visible ? "opacity-55 grayscale" : ""} ${
          isDragging ? "relative z-20 shadow-lg" : ""
        }`}
      >
      <div className="flex items-center gap-3 p-4">
        <button
          type="button"
          className="grid h-10 w-10 cursor-grab place-items-center rounded-md text-zinc-500 hover:bg-zinc-100 active:cursor-grabbing dark:hover:bg-zinc-900"
          aria-label="Drag block"
          {...attributes}
          {...listeners}
        >
          <FiMoreVertical />
        </button>
        <button
          type="button"
          onClick={onToggleExpanded}
          className="grid h-10 w-10 place-items-center rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900"
          aria-label={expanded ? "Collapse block" : "Expand block"}
        >
          {expanded ? <FiChevronDown /> : <FiChevronRight />}
        </button>
        <button type="button" onClick={onToggleExpanded} className="min-w-0 flex-1 text-left">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold">{getFriendlyLabel(section)}</h3>
            <Badge>{section.type}</Badge>
            {section.data?.variant && <Badge>{section.data.variant}</Badge>}
          </div>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Order {section.order}
          </p>
        </button>
        <button
          type="button"
          onClick={onToggleVisible}
          className={`inline-flex h-9 items-center gap-2 rounded-full px-3 text-sm transition ${
            section.visible
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
              : "bg-zinc-100 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400"
          }`}
        >
          {section.visible ? <FiEye /> : <FiEyeOff />}
          {section.visible ? "Visible" : "Hidden"}
        </button>
      </div>

      {expanded && (
        <CardContent className="grid gap-5 border-t border-zinc-200 dark:border-zinc-800">
          {getCollectionNote(section)}
          {fields.length > 0 && (
            <FormBuilder
              fields={fields}
              values={getFormValues(section.data || {}, fields)}
              onChange={onFieldChange}
            />
          )}
          {section.type === "logoMarquee" && (
            <RepeatableStringEditor
              label="Client logo URLs"
              values={section.data?.clientsBanners || []}
              onChange={(values) => onArrayChange("clientsBanners", values)}
            />
          )}
          {section.type === "technologyGrid" && (
            <TechnologyEditor
              values={section.data?.technologies || []}
              onChange={(values) => onArrayChange("technologies", values)}
            />
          )}
          {section.type === "imageFeed" && (
            <RepeatableStringEditor
              label="Image URLs"
              values={section.data?.images || []}
              onChange={(values) => onArrayChange("images", values)}
            />
          )}
          {fields.length === 0 &&
            !["logoMarquee", "technologyGrid", "imageFeed"].includes(section.type) && (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                This block controls section placement and visibility only.
              </p>
            )}
        </CardContent>
      )}
      </Card>
    </div>
  );
}

export default function HomePageForm(_: Props) {
  const { data, isLoading } = useGetHomePageDataQuery({});
  const [updateHomePage, { isLoading: isSaving }] = useUpdateHomePageDataMutation();
  const [sections, setSections] = useState<HomePageBlock[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const homeData = data?.data as (IHomePage & { _id?: string }) | undefined;
  const sectionIds = useMemo(() => sections.map((section) => section.id), [sections]);

  useEffect(() => {
    if (!homeData) return;
    const normalized = normalizeSections(homeData);
    setSections(normalized);
    setExpandedId((current) => current || normalized[0]?.id || null);
  }, [homeData]);

  const updateSection = (id: string, updater: (section: HomePageBlock) => HomePageBlock) => {
    setSections((current) =>
      current.map((section) => (section.id === id ? updater(section) : section))
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setSections((current) => {
      const oldIndex = current.findIndex((section) => section.id === active.id);
      const newIndex = current.findIndex((section) => section.id === over.id);
      return arrayMove(current, oldIndex, newIndex).map((section, index) => ({
        ...section,
        order: (index + 1) * 10,
      }));
    });
  };

  const handleSave = async () => {
    if (!homeData?._id) return;

    try {
      const response = await updateHomePage({
        id: homeData._id,
        data: {
          sections: sections.map((section, index) => ({
            ...section,
            order: (index + 1) * 10,
          })),
        },
      }).unwrap();

      if (response?.success) {
        toast.success("Home blocks saved");
      } else {
        toast.error("Failed to save home blocks");
      }
    } catch (error) {
      console.error("Failed to save home blocks", error);
      toast.error("Failed to save home blocks");
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto grid w-full max-w-5xl gap-4 px-4 py-8">
        <Skeleton className="h-10 w-64" />
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (!homeData) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-8">
        <Card>
          <CardContent className="p-6 text-sm text-zinc-500">
            Home page data was not found.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Home Page Blocks</h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Reorder sections, hide blocks, and edit the content that powers the live homepage.
          </p>
        </div>
        <Button type="button" onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save All Changes"}
        </Button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sectionIds} strategy={verticalListSortingStrategy}>
          <div className="grid gap-3">
            {sections.map((section) => (
              <SortableBlock
                key={section.id}
                section={section}
                expanded={expandedId === section.id}
                onToggleExpanded={() =>
                  setExpandedId((current) => (current === section.id ? null : section.id))
                }
                onToggleVisible={() =>
                  updateSection(section.id, (current) => ({
                    ...current,
                    visible: !current.visible,
                  }))
                }
                onFieldChange={(name, value) =>
                  updateSection(section.id, (current) => ({
                    ...current,
                    data: setByPath(current.data || {}, name, value),
                  }))
                }
                onArrayChange={(name, value) =>
                  updateSection(section.id, (current) => ({
                    ...current,
                    data: {
                      ...(current.data || {}),
                      [name]: value,
                    },
                  }))
                }
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
