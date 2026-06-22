import { ITestimonials } from '@/types/data';
import mongoose, { Schema, model, models } from 'mongoose';


const testimonialsfoSchema = new Schema<ITestimonials>(
    {
        name: { type: String, required: true },
        role: { type: String, required: true },
        profile: { type: String, required: true, unique: true },
        review: { type: String, required: true },
        tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag', default: [] }],
    },
    {
        timestamps: false,
    }
);

const Testimonial = models.Testimonial || model<ITestimonials>('Testimonial', testimonialsfoSchema);
export default Testimonial;
