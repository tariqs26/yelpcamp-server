import { Schema, model } from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
    immutable: true,
  },
});

UserSchema.plugin(passportLocalMongoose);

export default model('User', UserSchema);
