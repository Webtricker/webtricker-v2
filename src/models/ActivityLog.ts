import { Schema, model, models } from 'mongoose';

export interface IActivityLog {
  userEmail: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'ERROR' | 'WARNING' | 'OTHER';
  resource: string;
  details: string;
  createdAt: Date;
  updatedAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    userEmail: { type: String, required: true },
    action: { type: String, required: true },
    resource: { type: String, required: true },
    details: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const ActivityLog = models.ActivityLog || model<IActivityLog>('ActivityLog', ActivityLogSchema);
export default ActivityLog;
