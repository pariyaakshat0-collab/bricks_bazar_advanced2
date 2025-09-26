import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ISupplier extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  rating: number;
  isVerified: boolean;
  isActive: boolean;
  materials: string[];
  description?: string;
  website?: string;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SupplierSchema = new Schema<ISupplier>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  materials: [{
    type: String,
    trim: true
  }],
  description: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Supplier || mongoose.model<ISupplier>('Supplier', SupplierSchema);