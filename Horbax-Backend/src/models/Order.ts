import mongoose, { Document, Schema } from 'mongoose'

// Shape of one cloth item inside an order
export interface IClothItem {
  qty: number
  cloth: string
  wash: string
}

// Full order shape
export interface IOrder extends Document {
  orderId: string
  customerName: string
  phone: string
  items: IClothItem[]
  total: number
  paymentMethod: 'cash_pending' | 'cash_paid' | 'upi' | 'upi_cash'
  upiAmount: number
  cashAmount: number
  status: 'pending' | 'completed'
  deliveryDate?: string
  notes?: string
  completedAt?: Date
}

// Sub-schema for cloth items
const clothItemSchema = new Schema<IClothItem>({
  qty:   { type: Number, required: true, min: 1 },
  cloth: { type: String, required: true },
  wash:  { type: String, required: true },
})

// Main order schema
const orderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, unique: true },
    customerName: { type: String, required: true, trim: true },
    phone:        { type: String, required: true },
    items:        [clothItemSchema],
    total:        { type: Number, required: true, default: 0 },
    paymentMethod: {
      type: String,
      enum: ['cash_pending', 'cash_paid', 'upi', 'upi_cash'],
      default: 'cash_pending',
    },
    upiAmount:    { type: Number, default: 0 },
    cashAmount:   { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['pending','ready','completed'],
      default: 'pending',
    },
    deliveryDate: { type: String },
    notes:        { type: String },
    completedAt:  { type: Date },
  },
  { timestamps: true }
)

// Auto generate orderId like LP0001 before saving
orderSchema.pre('save', async function () {
  if (this.orderId) return
  const count = await mongoose.model('Order').countDocuments()
  this.orderId = 'LP' + String(count + 1).padStart(4, '0')
})

const Order = mongoose.model<IOrder>('Order', orderSchema)

export default Order