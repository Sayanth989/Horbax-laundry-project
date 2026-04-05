export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthResponse {
  token: string
  username: string
}

export interface Order {
  _id: string
  orderId: string
  customerName: string
  phone: string
  items: ClothItem[]
  total: number
  paymentMethod: 'cash_pending' | 'cash_paid' | 'upi' | 'upi+cash'
  upiAmount: number
  cashAmount: number
  status: 'pending' | 'ready' | 'completed'
  deliveryDate?: string
  notes?: string
  completedAt?: string
  createdAt: string
}

export interface ClothItem {
  qty: number
  cloth: string
  wash: string
}

export interface Customer {
  _id: string
  name: string
  phone: string
  totalOrders: number
  totalSpent: number
}

export interface WashType {
  name: string
  price: number
}

export interface Settings {
  washTypes: WashType[]
  clothTypes: string[]
}

export interface Expense {
  _id: string
  itemName: string
  amount: number
  category: string
  notes?: string
  createdAt: string
}

export interface CollectionSummary {
  totalCollected: number
  totalUPI: number
  totalCash: number
  totalPending: number
  completedOrders: number
  pendingOrders: number
}