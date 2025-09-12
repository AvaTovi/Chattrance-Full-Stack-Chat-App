import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  roomId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
  content: string,
  created: Date
}

const messageSchema: Schema<IMessage> = new Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Room'
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minLength: 1,
      maxLength: 500
    },
    created: {
      type: Date,
      required: true,
    }
  }
);

const Message = mongoose.model<IMessage>('Message', messageSchema);

export default Message;