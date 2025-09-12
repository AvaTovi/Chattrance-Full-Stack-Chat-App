import mongoose, { Schema, Document } from 'mongoose';
const messageSchema = new Schema({
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
});
const Message = mongoose.model('Message', messageSchema);
export default Message;
//# sourceMappingURL=message-model.js.map