import mongoose, { Document } from 'mongoose';
export interface IRoom extends Document {
    name: string;
    password: string;
    owner: mongoose.Schema.Types.ObjectId;
    created: Date;
}
declare const Room: mongoose.Model<IRoom, {}, {}, {}, mongoose.Document<unknown, {}, IRoom, {}, {}> & IRoom & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Room;
//# sourceMappingURL=room-model.d.ts.map