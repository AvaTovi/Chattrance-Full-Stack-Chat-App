import mongoose, { Schema, Document } from 'mongoose';
const resetTokenSchema = new Schema({
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
});
const ResetToken = mongoose.model('ResetToken', resetTokenSchema);
export default ResetToken;
//# sourceMappingURL=reset-token-model.js.map