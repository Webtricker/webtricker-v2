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
import SEOScorePanel from "@/dashboard/seo/SEOScorePanel";
import { Badge, Button, Card, CardContent, Skeleton } from "@/dashboard/ui";
import {
  useGetAboutPageDataQuery,
  useUpdateAboutPageDataMutation,
} from "@/redux/features/pageData/pageData";
import { AboutPageBlock, IAboutPage } from "@/types/pageTypes";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  FiChevronDown,
  FiChevronRight,
  FiEye,
  FiEyeOff,
  FiMoreVertical,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";
import { toast } from "react-toastify";

const inputClass =
  "min-h-11 rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950";

const collectionLinks: Record<string, { label: string; href: string }> = {
  teams: { label: "Team Members", href: "/settings/teams" },
  testimonials: { label: "Testimonials", href: "/settings/testimonials" },
};

const blockLabels: Record<string, string> = {
  aboutHero: "Hero Banner",
  aboutGallery: "Image Gallery",
  aboutIntroText: "Intro Text",
  aboutStory: "About / Mission / Goals / Why Us",
  whatWeOffer: "What We Offer",
  teamSlider: "Team Slider",
  funFacts: "Fun Facts / Stats",
  testimonialSlider: "Testimonials Slider",
  resumeCta: "Resume CTA",
};

type Props = {
  teamData?: unknown[];
  testimonialsData?: unknown[];
};

type SortableBlockProps = {
  section: AboutPageBlock;
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

const normalizeSections = (aboutData?: IAboutPage): AboutPageBlock[] =>
  [...(aboutData?.sections || [])]
    .sort((a, b) => a.order - b.order)
    .map((section, index) => ({ ...section, order: (index + 1) * 10 }));

const getFriendlyLabel = (section: AboutPageBlock) =>
  blockLabels[section.type] || section.type;

const getFields = (section: AboutPageBlock): FieldConfig[] => {
  switch (section.type) {
    case "aboutHero":
      return [
        { name: "bannerIntroText.top", label: "Intro top", type: "text", required: true },
        { name: "bannerIntroText.bottom", label: "Intro bottom", type: "text", required: true },
        { name: "bannerLargeText", label: "Large title", type: "textarea", required: true },
        { name: "bannerDescription", label: "Description", type: "textarea", required: true },
        { name: "scrollDwonText", label: "Scroll label", type: "text", required: true },
        { name: "bannerBottomText", label: "Bottom text", type: "textarea", required: true },
        { name: "bannerBottomBtnText", label: "Button text", type: "text", required: true },
        { name: "bannerBottomBtnLink", label: "Button link", type: "text", required: true },
        { name: "bannerBackgroundImage", label: "Background image", type: "image", required: true },
      ];
    case "aboutGallery":
      return [
        { name: "introImages.large", label: "Large image", type: "image", required: true },
        { name: "introImages.medium", label: "Medium image", type: "image", required: true },
        { name: "introImages.small", label: "Small image", type: "image", required: true },
      ];
    case "aboutIntroText":
      return [{ name: "introText", label: "Intro text", type: "textarea", required: true }];
    case "aboutStory":
      return [
        { name: "aboutUsText", label: "Title", type: "textarea", required: true, group: "About" },
        { name: "aboutUsDescription", label: "Description", type: "textarea", required: true, group: "About" },
        { name: "aboutUsImage", label: "Image", type: "image", required: true, group: "About" },
        { name: "ourMissionText", label: "Title", type: "text", required: true, group: "Mission" },
        { name: "ourMissionDescription", label: "Description", type: "textarea", required: true, group: "Mission" },
        { name: "ourGoalsText", label: "Title", type: "text", required: true, group: "Goals" },
        { name: "ourGoalsDescription", label: "Description", type: "textarea", required: true, group: "Goals" },
        { name: "whyUsText", label: "Title", type: "text", required: true, group: "Why Us" },
        { name: "whyUsDescription", label: "Description", type: "textarea", required: true, group: "Why Us" },
      ];
    case "whatWeOffer":
      return [
        { name: "whatWeOfferTitle", label: "Title", type: "text", required: true },
        { name: "whatWeOfferSubtitle", label: "Subtitle", type: "text", required: true },
        { name: "whatWeOfferCurveIconWhite", label: "Curve icon white", type: "image", required: true },
        { name: "whatWeOfferCurveIconBlack", label: "Curve icon black", type: "image", required: true },
      ];
    case "teamSlider":
      return [{ name: "title", label: "Section title", type: "text", required: true }];
    case "funFacts":
      return [
        { name: "aboutUsAnalytics.subTitle", label: "Subtitle", type: "text", required: true },
        { name: "aboutUsAnalytics.title", label: "Title", type: "textarea", required: true },
        { name: "aboutUsAnalytics.projectsCompleted", label: "Projects completed number", type: "text", required: true, group: "Projects Completed" },
        { name: "aboutUsAnalytics.projectsCompletedText", label: "Projects completed label", type: "text", required: true, group: "Projects Completed" },
        { name: "aboutUsAnalytics.teamMembers", label: "Team members number", type: "text", required: true, group: "Team Members" },
        { name: "aboutUsAnalytics.teamMembersText", label: "Team members label", type: "text", required: true, group: "Team Members" },
        { name: "aboutUsAnalytics.yearsOfExperience", label: "Years of experience number", type: "text", required: true, group: "Years of Experience" },
        { name: "aboutUsAnalytics.yearsOfExperienceText", label: "Years of experience label", type: "text", required: true, group: "Years of Experience" },
        { name: "aboutUsAnalytics.growingRate", label: "Growing rate number", type: "text", required: true, group: "Growing Rate" },
        { name: "aboutUsAnalytics.growingRateText", label: "Growing rate label", type: "text", required: true, group: "Growing Rate" },
      ];
    case "testimonialSlider":
      return [{ name: "sectionBg", label: "Background image", type: "image", required: true }];
    case "resumeCta":
      return [
        { name: "resumeeSendingText", label: "Resume text", type: "text", required: true },
        { name: "resumeeSendingEmail", label: "Resume email", type: "text", required: true },
        { name: "bottomTextLarge", label: "Large bottom text", type: "text", required: true },
      ];
    default:
      return [];
  }
};

const getCollectionNote = (section: AboutPageBlock) => {
  const collection = section.data?.collection;
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
            {section.type === "whatWeOffer" && (
              <RepeatableStringEditor
                label="Offer items"
                values={section.data?.whatWeOfferItems || []}
                onChange={(values) => onArrayChange("whatWeOfferItems", values)}
              />
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}

export default function AboutPageForm(_: Props) {
  const { data, isLoading } = useGetAboutPageDataQuery({});
  const [updateAboutPage, { isLoading: isSaving }] = useUpdateAboutPageDataMutation();
  const [sections, setSections] = useState<AboutPageBlock[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const aboutData = data?.data as (IAboutPage & { _id?: string }) | undefined;
  const sectionIds = useMemo(() => sections.map((section) => section.id), [sections]);

  useEffect(() => {
    if (!aboutData) return;
    const normalized = normalizeSections(aboutData);
    setSections(normalized);
    setExpandedId((current) => current || normalized[0]?.id || null);
  }, [aboutData]);

  const updateSection = (id: string, updater: (section: AboutPageBlock) => AboutPageBlock) => {
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
    if (!aboutData?._id) return;

    try {
      const response = await updateAboutPage({
        id: aboutData._id,
        data: {
          sections: sections.map((section, index) => ({
            ...section,
            order: (index + 1) * 10,
          })),
        },
      }).unwrap();

      if (response?.success) {
        toast.success("About blocks saved");
      } else {
        toast.error("Failed to save about blocks");
      }
    } catch (error) {
      console.error("Failed to save about blocks", error);
      toast.error("Failed to save about blocks");
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

  if (!aboutData) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-8">
        <Card>
          <CardContent className="p-6 text-sm text-zinc-500">
            About page data was not found.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">About Page Blocks</h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Reorder sections, hide blocks, and edit the content that powers the live About page.
          </p>
        </div>
        <Button type="button" onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save All Changes"}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
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
        <div className="lg:sticky lg:top-4 lg:self-start">
          <SEOScorePanel
            mode="metadata-only"
            sectionCount={sections.filter((s) => s.visible !== false).length}
          />
        </div>
      </div>
    </div>
  );
}
