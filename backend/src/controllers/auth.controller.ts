import { Request, Response } from 'express'
import { authService } from '../services/auth.service'

export const authController = {

  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body

      // Validación básica
      if (!name || !email || !password) {
        return res.status(400).json({ 
          error: 'Nombre, email y contraseña son obligatorios' 
        })
      }

      if (password.length < 8) {
        return res.status(400).json({ 
          error: 'La contraseña debe tener mínimo 8 caracteres' 
        })
      }

      const result = await authService.register({ name, email, password })
      return res.status(201).json(result)

    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        return res.status(400).json({ 
          error: 'Email y contraseña son obligatorios' 
        })
      }

      const result = await authService.login({ email, password })
      return res.status(200).json(result)

    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  },

  async me(req: Request, res: Response) {
    try {
      return res.status(200).json({ user: req.user })
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  }
}