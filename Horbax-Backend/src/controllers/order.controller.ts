import { Request, Response } from 'express'
import Order from '../models/Order.js'
import Customer from '../models/coutomer.js'



// GET /api/orders
export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}



// GET /api/orders/pending
export const getPendingOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({ status: 'pending' }).sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}



// GET /api/orders/:id
export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) {
      res.status(404).json({ message: 'Order not found' })
      return
    }
    res.json(order)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}



// POST /api/orders
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      customerName,
      phone,
      items,
      total,
      deliveryDate,
      notes,
    } = req.body

    // Auto create customer if not exists
    const existingCustomer = await Customer.findOne({ phone })
    if (!existingCustomer) {
      await Customer.create({ name: customerName, phone })
    }

    const order = await Order.create({
      customerName,
      phone,
      items,
      total,
      deliveryDate,
      notes,
      status :'pending',
      paymentMethod:'cash_pending' // by defult
    })

    res.status(201).json(order)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}



// PATCH /api/orders/:id
export const updateOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const updates = req.body

    // If marking as completed, record the time
    if (updates.status === 'completed') {
      updates.completedAt = new Date()
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }  // return updated document
    )

    if (!order) {
      res.status(404).json({ message: 'Order not found' })
      return
    }

    res.json(order)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}



// DELETE /api/orders/:id
export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id)
    if (!order) {
      res.status(404).json({ message: 'Order not found' })
      return
    }
    res.json({ message: 'Order deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}



// PATCH /api/orders/:id/collect
// Called when customer comes to pick up
export const collectOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { paymentMethod, total, upiAmount, cashAmount } = req.body

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: 'completed',
        paymentMethod,
        total,
        upiAmount:   upiAmount   || 0,
        cashAmount:  cashAmount  || 0,
        completedAt: new Date(),
      },
      { new: true }
    )

    if (!order) {
      res.status(404).json({ message: 'Order not found' })
      return
    }

    res.json(order)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}