import mongoose, { Schema, Document } from 'mongoose';

export interface IResetToken extends Document {
  _id: mongoose.Schema.Types.ObjectId
  token: string,
  userId: mongoose.Types.ObjectId,
  expires: Date
}

const resetTokenSchema: Schema<IResetToken> = new Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    expires: {
      type: Date,
      required: true
    }
  }
);

const ResetToken = mongoose.model<IResetToken>('ResetToken', resetTokenSchema);

export default ResetToken;