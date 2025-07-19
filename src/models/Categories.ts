import { Schema, model, models } from 'mongoose';

export interface Category {
 name:string;
}
const categorySchema = new Schema<Category>(
  {
    name: { type:String, required: true ,unique: true},  },
  {
    timestamps: false,
  }
);

const Categories = models.Categories || model<Category>('Categories', categorySchema);
export default Categories;
