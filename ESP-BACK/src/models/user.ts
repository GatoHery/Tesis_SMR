import { Schema, model, Types } from 'mongoose'

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    receiveAlerts: { type: Boolean, default: true },
    role: { type: Types.ObjectId, ref: 'Role', required: true }
  },
  { timestamps: true }
)

UserSchema.methods.toJSON = function () {
  const { __v, password, _id, ...user } = this.toObject()
  user.uid = _id
  return user
}

export const User = model('User', UserSchema)
