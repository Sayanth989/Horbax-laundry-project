import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import Admin from '..//models/Admin.js'
import { AuthResponse, JwtPayload } from '../types/type.js'

// Helper
const generateToken = (id: string, username: string): string => {
  return jwt.sign(
    { id, username } as JwtPayload,
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' }
  )
}

// POST /api/auth/setup
export const setupAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const existing = await Admin.findOne({})
    if (existing) {
      res.status(400).json({ message: 'Admin already exists' })
      return
    }
    const admin = await Admin.create({
      username: process.env.ADMIN_USERNAME || 'admin',
      password: process.env.ADMIN_PASSWORD || 'admin123',
    })
    res.status(201).json({ message: 'Admin created!', username: admin.username })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// POST /api/auth/login
export const loginAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body

    const admin = await Admin.findOne({ username })
    if (!admin || !(await admin.matchPassword(password))) {
      res.status(401).json({ message: 'Invalid username or password' })
      return
    }

    const response: AuthResponse = {
      token: generateToken(admin._id.toString(), admin.username),
      username: admin.username,
    }
    res.json(response)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// POST /api/auth/change-password
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, newPassword } = req.body
    const admin = await Admin.findOne({ username })
    if (!admin) {
      res.status(404).json({ message: 'Admin not found' })
      return
    }
    admin.password = newPassword
    await admin.save()
    res.json({ message: 'Password updated!' })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}