"use client";

import FormBuilder, { FieldConfig } from "@/dashboard/FormBuilder";
import { Button, Card, CardContent, CardHeader } from "@/dashboard/ui";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

// ---- types ----

type ContactFlatValues = Record<string, any>;

type DeprecatedFields = {
  greetings_bottomTxt: string;
  form_mailTo: string;
  leftPanel_socialLinks: { icon: string; href: string }[];
  address_addresses: { office: string; location: string }[];
  contactNumber_numbers: string[];
  contactMails_mails: string[];
};

// ---- field config ----

const contactFields: FieldConfig[] = [
  { name: "branding", type: "text", required: true, label: "Eyebrow Text", group: "Hero" },
  { name: "title", type: "text", required: true, label: "Page Heading", group: "Hero" },
  { name: "greetings_topTxt", type: "text", required: true, label: "Greeting Heading", group: "Hero" },
  { name: "leftPanel_text", type: "text", required: true, label: "Social Rail Label", group: "Hero" },

  { name: "greetings_iconBlack", type: "image", label: "Greeting Icon (Light Mode)", group: "Greeting Icons" },
  { name: "greetings_iconWhite", type: "image", label: "Greeting Icon (Dark Mode)", group: "Greeting Icons" },

  { name: "form_name_label", type: "text", required: true, label: "Name Field Label", group: "Contact Form" },
  { name: "form_name_placeholder", type: "text", required: true, label: "Name Field Placeholder", group: "Contact Form" },
  { name: "form_email_label", type: "text", required: true, label: "Email Field Label", group: "Contact Form" },
  { name: "form_email_placeholder", type: "text", required: true, label: "Email Field Placeholder", group: "Contact Form" },
  { name: "form_message_label", type: "text", required: true, label: "Message Field Label", group: "Contact Form" },
  { name: "form_message_placeholder", type: "text", required: true, label: "Message Field Placeholder", group: "Contact Form" },
  { name: "form_btnText", type: "text", required: true, label: "Submit Button Text", group: "Contact Form" },

  { name: "contactInformationTitle", type: "text", required: true, label: "Section Heading", group: "Contact Info" },
  { name: "address_title", type: "text", required: true, label: "Address Sub-heading", group: "Contact Info" },
  { name: "address_iconBlack", type: "image", label: "Address Icon (Light Mode)", group: "Contact Info" },
  { name: "address_iconWhite", type: "image", label: "Address Icon (Dark Mode)", group: "Contact Info" },
  { name: "contactNumber_title", type: "text", required: true, label: "Phone Sub-heading", group: "Contact Info" },
  { name: "contactNumber_iconBlack", type: "image", label: "Phone Icon (Light Mode)", group: "Contact Info" },
  { name: "contactNumber_iconWhite", type: "image", label: "Phone Icon (Dark Mode)", group: "Contact Info" },
  { name: "contactMails_title", type: "text", required: true, label: "Email Sub-heading", group: "Contact Info" },
  { name: "contactMails_iconBlack", type: "image", label: "Email Icon (Light Mode)", group: "Contact Info" },
  { name: "contactMails_iconWhite", type: "image", label: "Email Icon (Dark Mode)", group: "Contact Info" },

  { name: "googleMap_title", type: "text", required: true, label: "Map Heading", group: "Map" },
  { name: "googleMap_iframe", type: "textarea", required: true, label: "Google Maps Embed URL", group: "Map" },
];

// ---- helpers ----

const emptyFlat: ContactFlatValues = {
  branding: "",
  title: "",
  greetings_topTxt: "",
  greetings_iconBlack: "",
  greetings_iconWhite: "",
  leftPanel_text: "",
  form_name_label: "",
  form_name_placeholder: "",
  form_email_label: "",
  form_email_placeholder: "",
  form_message_label: "",
  form_message_placeholder: "",
  form_btnText: "",
  contactInformationTitle: "",
  address_title: "",
  address_iconBlack: "",
  address_iconWhite: "",
  contactNumber_title: "",
  contactNumber_iconBlack: "",
  contactNumber_iconWhite: "",
  contactMails_title: "",
  contactMails_iconBlack: "",
  contactMails_iconWhite: "",
  googleMap_title: "",
  googleMap_iframe: "",
};

const emptyDeprecated: DeprecatedFields = {
  greetings_bottomTxt: "",
  form_mailTo: "",
  leftPanel_socialLinks: [],
  address_addresses: [],
  contactNumber_numbers: [],
  contactMails_mails: [],
};

function flattenContactData(data: any): ContactFlatValues {
  return {
    branding: data.branding || "",
    title: data.title || "",
    greetings_topTxt: data.greetings?.topTxt || "",
    greetings_iconBlack: data.greetings?.iconBlack || "",
    greetings_iconWhite: data.greetings?.iconWhite || "",
    leftPanel_text: data.leftPanel?.text || "",
    form_name_label: data.form?.name?.label || "",
    form_name_placeholder: data.form?.name?.placeholder || "",
    form_email_label: data.form?.email?.label || "",
    form_email_placeholder: data.form?.email?.placeholder || "",
    form_message_label: data.form?.message?.label || "",
    form_message_placeholder: data.form?.message?.placeholder || "",
    form_btnText: data.form?.btnText || "",
    contactInformationTitle: data.contactInformationTitle || "",
    address_title: data.address?.title || "",
    address_iconBlack: data.address?.iconBlack || "",
    address_iconWhite: data.address?.iconWhite || "",
    contactNumber_title: data.contactNumber?.title || "",
    contactNumber_iconBlack: data.contactNumber?.iconBlack || "",
    contactNumber_iconWhite: data.contactNumber?.iconWhite || "",
    contactMails_title: data.contactMails?.title || "",
    contactMails_iconBlack: data.contactMails?.iconBlack || "",
    contactMails_iconWhite: data.contactMails?.iconWhite || "",
    googleMap_title: data.googleMap?.title || "",
    googleMap_iframe: data.googleMap?.iframe || "",
  };
}

function extractDeprecated(data: any): DeprecatedFields {
  return {
    greetings_bottomTxt: data.greetings?.bottomTxt || "",
    form_mailTo: data.form?.mailTo || "",
    leftPanel_socialLinks: data.leftPanel?.socialLinks || [],
    address_addresses: data.address?.addresses || [],
    contactNumber_numbers: data.contactNumber?.numbers || [],
    contactMails_mails: data.contactMails?.mails || [],
  };
}

function reconstructContactData(flat: ContactFlatValues, deprecated: DeprecatedFields) {
  return {
    branding: flat.branding,
    title: flat.title,
    greetings: {
      topTxt: flat.greetings_topTxt,
      bottomTxt: deprecated.greetings_bottomTxt,
      iconBlack: flat.greetings_iconBlack,
      iconWhite: flat.greetings_iconWhite,
    },
    form: {
      name: { label: flat.form_name_label, placeholder: flat.form_name_placeholder },
      email: { label: flat.form_email_label, placeholder: flat.form_email_placeholder },
      message: { label: flat.form_message_label, placeholder: flat.form_message_placeholder },
      btnText: flat.form_btnText,
      mailTo: deprecated.form_mailTo,
    },
    leftPanel: {
      text: flat.leftPanel_text,
      socialLinks: deprecated.leftPanel_socialLinks,
    },
    contactInformationTitle: flat.contactInformationTitle,
    address: {
      title: flat.address_title,
      iconBlack: flat.address_iconBlack,
      iconWhite: flat.address_iconWhite,
      addresses: deprecated.address_addresses,
    },
    contactNumber: {
      title: flat.contactNumber_title,
      iconBlack: flat.contactNumber_iconBlack,
      iconWhite: flat.contactNumber_iconWhite,
      numbers: deprecated.contactNumber_numbers,
    },
    contactMails: {
      title: flat.contactMails_title,
      iconBlack: flat.contactMails_iconBlack,
      iconWhite: flat.contactMails_iconWhite,
      mails: deprecated.contactMails_mails,
    },
    googleMap: {
      title: flat.googleMap_title,
      iframe: flat.googleMap_iframe,
    },
  };
}

// ---- component ----

export default function ContactPageForm() {
  const [docId, setDocId] = useState("");
  const [values, setValues] = useState<ContactFlatValues>(emptyFlat);
  const [deprecated, setDeprecated] = useState<DeprecatedFields>(emptyDeprecated);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/contact-page", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data?.data) {
          setDocId(data.data._id || "");
          setValues(flattenContactData(data.data));
          setDeprecated(extractDeprecated(data.data));
        }
      })
      .catch(() => toast.error("Failed to load contact page data"))
      .finally(() => setLoading(false));
  }, []);

  const validate = () => {
    const next: Record<string, string> = {};
    for (const field of contactFields) {
      if (field.required && field.type !== "image") {
        if (!String(values[field.name] || "").trim()) {
          next[field.name] = "This field is required";
        }
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const response = await fetch("/api/contact-page", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: docId,
          data: reconstructContactData(values, deprecated),
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Failed to save");
      toast.success("Contact page saved");
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
      <form className="grid gap-5" onSubmit={handleSubmit}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
              Contact Page
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Edit headings, contact form labels, section icons, and the map embed.
              Phones, emails, offices, and social links are managed in Site Settings.
            </p>
          </div>
          <Button type="submit" disabled={submitting} className="whitespace-nowrap shrink-0">
            {submitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
        <FormBuilder
          fields={contactFields}
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
    </div>
  );
}
