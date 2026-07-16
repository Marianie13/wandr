import { Router } from 'express'
import { authController } from '../controllers/auth.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

const router = Router()

// Rutas públicas — no necesitan JWT
router.post('/register', authController.register)
router.post('/login', authController.login)

// Ruta protegida — necesita JWT
router.get('/me', authMiddleware, authController.me)

export default router