import { ITeam } from '@/types/data';
import { Schema, model, models } from 'mongoose';


const teamInfoSchema = new Schema<ITeam>(
    {
        name: { type: String, required: true },
        role: { type: String, required: true },
        profile: { type: String, required: true, unique: true },
    },
    {
        timestamps: false,
    }
);

const Team = models.Team || model<ITeam>('Team', teamInfoSchema);
export default Team;
    