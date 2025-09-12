import mongoose, { Schema, Document } from 'mongoose';
export interface IResetToken extends Document {
    _id: mongoose.Schema.Types.ObjectId;
    token: string;
    userId: mongoose.Types.ObjectId;
    expires: Date;
}
declare const ResetToken: mongoose.Model<IResetToken, {}, {}, {}, mongoose.Document<unknown, {}, IResetToken, {}, {}> & IResetToken & Required<{
    _id: Schema.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default ResetToken;
//# sourceMappingURL=reset-token-model.d.ts.map