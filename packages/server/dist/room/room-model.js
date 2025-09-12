import mongoose, { Schema, Document } from 'mongoose';
const roomSchema = new Schema({
    name: {
        type: String,
        required: false,
        trim: true,
        maxLength: 64
    },
    password: {
        type: String,
        required: false,
        minLength: 60,
        maxLength: 60
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    created: {
        type: Date,
        default: Date.now
    }
});
const Room = mongoose.model('Room', roomSchema);
export default Room;
//# sourceMappingURL=room-model.js.map