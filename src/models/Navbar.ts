import { TNavlink } from '@/types/data';
import { Schema, model, models } from 'mongoose';

export interface INavbar {
    links: TNavlink[];
}

const navbarSchema = new Schema<INavbar>(
    {
        links: [
            {
                label: { type: String, required: true },
                href: { type: String, required: true },
                target: { type: String, enum: ['_blank', '_self'], required: true },
            },
        ],
    },
    {
        timestamps: false,
    }
);

const Navbar = models.Navbar || model<INavbar>('Navbar', navbarSchema);
export default Navbar;
