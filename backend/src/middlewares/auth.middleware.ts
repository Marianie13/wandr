import jwt from 'jsonwebtoken'
import { jwtConfig } from '../config/jwt.config'

export const authMiddleware = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization']

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token no proporcionado' })
    return
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, jwtConfig.secret) as {
      id: string
      email: string
    }
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ error: 'Token inválido o expirado' })
  }
}