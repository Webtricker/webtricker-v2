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

const Category = models.Category || model<Category>('Category', categorySchema);
export default Category;
