import { Schema, model } from 'mongoose'

const RoleSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String }
  },
  { timestamps: true }
)

RoleSchema.methods.toJSON = function () {
  const { __v, _id, ...role } = this.toObject()
  role.uid = _id
  return role
}

export const Role = model('Role', RoleSchema)
