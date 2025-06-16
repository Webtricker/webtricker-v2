import { DbMenuLink, DbMenuType } from '@/types/menu';
import mongoose, { Schema, Document, model } from 'mongoose';

export interface IMenu extends Document {
  menuType: DbMenuType;
  links: DbMenuLink[];
  defaultLinks: DbMenuLink[];
  createdAt: Date;
  updatedAt: Date;
}

const linkSchema = new Schema<DbMenuLink>(
  {
    label: { type: String, required: true },
    url: { type: String, required: true },
    target: { type: String, enum: ['_self', '_blank'], default: '_self' },
  },
  { _id: false } // no _id for subdocs
);

const menuSchema = new Schema<IMenu>(
  {
    menuType: {
      type: String,
      enum: ['header', 'footer'],
      required: true,
    },
    links: {
      type: [linkSchema],
      default: [],
    },
    defaultLinks:{
       type: [linkSchema],
      default: [],
    }
  },
  { timestamps: true } // adds createdAt and updatedAt
);

export default mongoose.models.Menu || model<IMenu>('Menu', menuSchema);
