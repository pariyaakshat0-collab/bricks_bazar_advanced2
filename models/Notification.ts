import mongoose, { Document, Schema, Types } from 'mongoose';

export interface INotification extends Document {
  _id: Types.ObjectId;
  title: string;
  content: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'ORDER_UPDATE' | 'SUPPLIER_UPDATE' | 'MESSAGE';
  isRead: boolean;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['INFO', 'SUCCESS', 'WARNING', 'ERROR', 'ORDER_UPDATE', 'SUPPLIER_UPDATE', 'MESSAGE'],
    default: 'INFO'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);