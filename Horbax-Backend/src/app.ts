import express, { Application } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'// 👈 import your db file

import router from './routes/auth.routes.js'

import { protect } from './middleware/auth.middleware.js'






dotenv.config()

const app: Application = express()

// Connect to MongoDB
connectDB()  

// Middleware
app.use(cors())
app.use(express.json())

// Test route
app.use('/api/auth',router)


// app.get("/api/test",protect,(req,res)=>{
//   res.json({msg:`hello${req.admin?.username}`})
// })




app.get('/', (req, res) => {
  res.json({ message: '🧺 LaundryPro API is running!' })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})