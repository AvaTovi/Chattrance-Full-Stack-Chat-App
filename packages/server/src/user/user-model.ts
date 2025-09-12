import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
	_id: mongoose.Schema.Types.ObjectId
	name: string,
	email: string,
	password: string,
	created: Date
}

const userSchema: Schema<IUser> = new Schema(
	{
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
	},
	{ timestamps: false }
);

const User = mongoose.model<IUser>('User', userSchema);

export default User;

