import mongoose, { Document } from 'mongoose';
export interface IMessage extends Document {
    roomId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    content: string;
    created: Date;
}
declare const Message: mongoose.Model<IMessage, {}, {}, {}, mongoose.Document<unknown, {}, IMessage, {}, {}> & IMessage & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Message;
//# sourceMappingURL=message-model.d.ts.map