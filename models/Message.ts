import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IMessage extends Document {
  _id: Types.ObjectId;
  content: string;
  isRead: boolean;
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  orderId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  content: {
    type: String,
    required: true,
    trim: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order'
  }
}, {
  timestamps: true
});

export default mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);