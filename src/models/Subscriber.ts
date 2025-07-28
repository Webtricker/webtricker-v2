import { Schema, model, models } from 'mongoose';

export interface ISubscriber {
    email: string;
    isVerified: boolean;
    otp: string;
    otpExpiresAt: Date;
}

const subscriberSchema = new Schema<ISubscriber>(
    {
        email: { type: String, required: true, unique: true },
        isVerified: { type: Boolean, default: false },
        otp: { type: String, default: '' },
        otpExpiresAt: { type: Date, default: () => new Date() },
    },
    {
        timestamps: true,
    }
);

// Correct index syntax
subscriberSchema.index({ isVerified: 1 });

const SubscriberModel = models.Subscriber || model<ISubscriber>('Subscriber', subscriberSchema);
export default SubscriberModel;
