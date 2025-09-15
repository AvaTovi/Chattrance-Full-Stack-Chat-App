import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  _id: mongoose.Schema.Types.ObjectId,
  roomId: mongoose.Schema.Types.ObjectId,
  userId: mongoose.Schema.Types.ObjectId,
  username: string,
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
    username: {
      type: String,
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
      default: new Date()
    }
  }
);

const Message = mongoose.model<IMessage>('Message', messageSchema);

export default Message;