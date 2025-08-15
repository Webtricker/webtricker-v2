import { Schema, model, models } from 'mongoose';

export interface ITechnology {
 name:string;
}
const technologySchema = new Schema<ITechnology>(
  {
    name: { type:String, required: true ,unique: true},  },
  {
    timestamps: false,
  }
);

const Technology = models.Technology || model<ITechnology>('Technology', technologySchema);
export default Technology;
