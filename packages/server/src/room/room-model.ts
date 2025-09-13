import mongoose, { Schema, Document } from 'mongoose';

export interface IRoom extends Document {
  _id: mongoose.Schema.Types.ObjectId,
  name: string,
  password: string | null,
  owner: mongoose.Schema.Types.ObjectId,
  created: Date,
  members: mongoose.Schema.Types.ObjectId[]
}

const roomSchema: Schema<IRoom> = new Schema(
  {
    name: {
      type: String,
      unique: false,
      maxLength: 64,
    },
    password: {
      type: String,
      minLength: 60,
      maxLength: 60,
      default: null
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    created: {
      type: Date,
      default: new Date()
    },
    members: {
      type: [{
        type: mongoose.Schema.ObjectId,
        required: false,
        ref: 'User'
      }],
      required: true
    }
  }
);

const Room = mongoose.model<IRoom>('Room', roomSchema);

export default Room;