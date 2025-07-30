import { ITestimonials } from '@/types/data';
import { Schema, model, models } from 'mongoose';


const testimonialsfoSchema = new Schema<ITestimonials>(
    {
        name: { type: String, required: true },
        role: { type: String, required: true },
        profile: { type: String, required: true, unique: true },
        review: { type: String, required: true },
    },
    {
        timestamps: false,
    }
);

const Testimonial = models.Testimonial || model<ITestimonials>('Testimonial', testimonialsfoSchema);
export default Testimonial;
