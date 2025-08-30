import { IContactPage } from '@/types/pageTypes';
import { Schema, model, models } from 'mongoose';

const formInputSchema = new Schema(
  {
    label: { type: String, required: true },
    placeholder: { type: String, required: true },
  },
  { _id: false }
);

const contactFormSchema = new Schema(
  {
    name: { type: formInputSchema, required: true },
    email: { type: formInputSchema, required: true },
    message: { type: formInputSchema, required: true },
    btnText: { type: String, required: true },
    mailTo: { type: String, required: true },
  },
  { _id: false }
);

const contactAddressSchema = new Schema(
  {
    iconWhite: { type: String, required: true },
    iconBlack: { type: String, required: true },
    title: { type: String, required: true },
    addresses: [
      {
        office: { type: String, required: true },
        location: { type: String, required: true },
      },
    ],
  },
  { _id: false }
);

const phoneSchema = new Schema(
  {
    iconWhite: { type: String, required: true },
    iconBlack: { type: String, required: true },
    title: { type: String, required: true },
    numbers: [{ type: String, required: true }],
  },
  { _id: false }
);

const emailSchema = new Schema(
  {
    iconWhite: { type: String, required: true },
    iconBlack: { type: String, required: true },
    title: { type: String, required: true },
    mails: [{ type: String, required: true }],
  },
  { _id: false }
);

const greetingsSchema = new Schema(
  {
    topTxt: { type: String, required: true },
    bottomTxt: { type: String, required: true },
    iconBlack: { type: String, required: true },
    iconWhite: { type: String, required: true },
  },
  { _id: false }
);

const leftPanelSchema = new Schema(
  {
    socialLinks: [
      {
        icon: { type: String, required: true },
        href: { type: String, required: true },
      },
    ],
    text: { type: String, required: true },
  },
  { _id: false }
);

const googleMapSchema = new Schema(
  {
    title: { type: String, required: true },
    iframe: { type: String, required: true },
  },
  { _id: false }
);

const contactPageSchema = new Schema<IContactPage>(
  {
    branding: { type: String, required: true },
    title: { type: String, required: true },
    greetings: { type: greetingsSchema, required: true },
    form: { type: contactFormSchema, required: true },
    leftPanel: { type: leftPanelSchema, required: true },
    contactInformationTitle: { type: String, required: true },
    address: { type: contactAddressSchema, required: true },
    contactNumber: { type: phoneSchema, required: true },
    contactMails: { type: emailSchema, required: true },
    googleMap: { type: googleMapSchema, required: true },
  },
  {
    timestamps: false,
  }
);

const ContactPage =
  models.ContactPage || model<IContactPage>('ContactPage', contactPageSchema);

export default ContactPage;
