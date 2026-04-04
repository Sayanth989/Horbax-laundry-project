import mongoose, { Document, Schema } from 'mongoose'

export interface IWashType {
  name:  string
  price: number
}


export interface ISettings extends Document {
  washTypes:  IWashType[]
  clothTypes: string[]
}

const washTypeSchema = new Schema<IWashType>({
  name:  { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
})
const settingsSchema = new Schema<ISettings>(
  {
    washTypes:  [washTypeSchema],
    clothTypes: [{ type: String }],
  },
  { timestamps: true }
)

const Settings = mongoose.model<ISettings>('Settings', settingsSchema)
export default Settings