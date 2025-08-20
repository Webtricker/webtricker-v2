import { ILeader } from '@/types/data';
import { Schema, model, models } from 'mongoose';


const leaderInfoSchema = new Schema<ILeader>(
    {
        name: { type: String, required: true },
        role: { type: String, required: true },
        profile: { type: String, required: true, unique: true },
        facebookLink: { type: String, required: true },
        instagramLink: { type: String, required: true },
        linkedInLink: { type: String, required: true },

    },
    {
        timestamps: false,
    }
);

const Leader = models.Leader || model<ILeader>('Leader', leaderInfoSchema);
export default Leader;
