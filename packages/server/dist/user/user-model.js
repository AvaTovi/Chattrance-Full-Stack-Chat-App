import mongoose, { Schema, Document } from 'mongoose';
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxLength: 256
    },
    name: {
        type: String,
        required: true,
        unique: true,
        maxLength: 64
    },
    password: {
        type: String,
        required: true,
        minLength: 60,
        maxLength: 60
    },
    created: {
        type: Date,
        default: Date.now
    }
}, { timestamps: false });
const User = mongoose.model('User', userSchema);
export default User;
//# sourceMappingURL=user-model.js.map