import mongoose, { Schema, Document } from 'mongoose';
export interface IUser extends Document {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    created: Date;
}
declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: Schema.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default User;
//# sourceMappingURL=user-model.d.ts.map