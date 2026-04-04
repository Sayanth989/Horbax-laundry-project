import { Request, Response } from 'express'
import Settings, { ISettings } from '../models/settings.js'




// Default settings for first time setup
const defaultSettings = {
  washTypes: [
    { name: 'Steam Wash',   price: 80  },
    { name: 'Heavy Wash',   price: 120 },
    { name: 'Dry Clean',    price: 200 },
    { name: 'Quick Wash',   price: 60  },
    { name: 'Ironing Only', price: 30  },
  ],
  clothTypes: [
    'Shirt', 'Pant', 'Saree', 'Salwar',
    'Jeans', 'Bedsheet', 'Towel', 'Jacket', 'Kurta',
  ],
}
//leter we can add this









// Helper — get settings or create default if not exists
const getOrCreateSettings = async (): Promise<ISettings> => {
  let settings = await Settings.findOne()
  if (!settings) {
    settings = await Settings.create(defaultSettings)
  }
  return settings
}

// GET /api/settings                            //req assign as string
export const getSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const settings = await getOrCreateSettings()
    res.json(settings)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// POST /api/settings/wash
// Add a new wash type
export const addWashType = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, price } = req.body

    if (!name || price === undefined) {
      res.status(400).json({ message: 'Name and price are required' })
      return
    }

    const settings = await getOrCreateSettings()
    settings.washTypes.push({ name, price })
    await settings.save()

    res.json(settings)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// DELETE /api/settings/wash/:index
// Remove a wash type by its position in the array
export const deleteWashType = async (req: Request, res: Response): Promise<void> => {
  try {
    const index = parseInt(req.params.index as string)
    const settings = await getOrCreateSettings()

    if (index < 0 || index >= settings.washTypes.length) {
      res.status(400).json({ message: 'Invalid index' })
      return
    }

    settings.washTypes.splice(index, 1)
    await settings.save()

    res.json(settings)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// PATCH /api/settings/wash/:index
// Edit an existing wash type price or name
export const updateWashType = async (req: Request, res: Response): Promise<void> => {
  try {
    const index = parseInt(req.params.index as string)  // as measn maybe its string
    const { name, price } = req.body
    const settings = await getOrCreateSettings()

    if (index < 0 || index >= settings.washTypes.length) {
      res.status(400).json({ message: 'Invalid index' })
      return
    }

    // Only update fields that were sent
    if (name  !== undefined) settings.washTypes[index].name  = name
    if (price !== undefined) settings.washTypes[index].price = price

    await settings.save()
    res.json(settings)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// POST /api/settings/cloth
// Add a new cloth type
export const addClothType = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body

    if (!name) {
      res.status(400).json({ message: 'Name is required' })
      return
    }

    const settings = await getOrCreateSettings()

    // Prevent duplicates
    if (settings.clothTypes.includes(name)) {
      res.status(400).json({ message: 'Cloth type already exists' })
      return
    }

    settings.clothTypes.push(name)
    await settings.save()

    res.json(settings)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// DELETE /api/settings/cloth/:index
export const deleteClothType = async (req: Request, res: Response): Promise<void> => {
  try {
    const index = parseInt(req.params.index as string)
    const settings = await getOrCreateSettings()

    if (index < 0 || index >= settings.clothTypes.length) {
      res.status(400).json({ message: 'Invalid index' })
      return
    }

    settings.clothTypes.splice(index, 1)
    await settings.save()

    res.json(settings)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}