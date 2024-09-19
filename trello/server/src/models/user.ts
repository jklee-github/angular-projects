import { Schema, model } from 'mongoose';
import { UserDocument } from '../types/user.interface';
import validator from 'validator';
import bcryptjs from 'bcryptjs';

const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      validate: [validator.isEmail, 'invalid email'],
      createIndexes: { unique: true },
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      // important to set to false, we don't want this return to console or anywhere
      // one more step in controllers/users.ts, we must normalize the user
      // since on newUser.save(), password field will be selected

      // only once case we want to select is when login, in controllers.users.ts:
      // const user = await UserModel.findOne({ email: req.body.email }).select(
      // '+password'
      // );

      select: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err as Error);
  }
});

userSchema.methods.validatePassword = function (password: string) {
  console.log('validatePassword', password, this);
  return bcryptjs.compare(password, this.password);
};

export default model<UserDocument>('User', userSchema);
