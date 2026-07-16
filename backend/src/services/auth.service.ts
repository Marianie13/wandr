import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { randomUUID } from 'crypto'
import { authRepository } from '../repositories/auth.repository'
import { jwtConfig } from '../config/jwt.config'
import { User } from '../models/user.model'

// DTOs — definen qué datos esperamos recibir
interface RegisterDTO {
  name: string
  email: string
  password: string
}

interface LoginDTO {
  email: string
  password: string
}

export const authService = {

  async register(data: RegisterDTO) {
    // 1. Verificar si el email ya existe
    const existingUser = await authRepository.findByEmail(data.email)
    if (existingUser) {
      throw new Error('El email ya está registrado')
    }

    // 2. Convertir la contraseña en hash
    const hashedPassword = await bcrypt.hash(data.password, 10)

    // 3. Crear el usuario
    const newUser: User = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password: hashedPassword,
      createdAt: new Date()
    }

    // 4. Guardar en la BD
    await authRepository.create(newUser)

    // 5. Generar JWT
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    )

    // 6. Devolver token — nunca devolvemos el password
    return {
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    }
  },

  async login(data: LoginDTO) {
    // 1. Buscar el usuario por email
    const user = await authRepository.findByEmail(data.email)
    if (!user) {
      throw new Error('Credenciales inválidas')
    }

    // 2. Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(data.password, user.password)
    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas')
    }

    // 3. Generar JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    )

    // 4. Devolver token
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    }
  }
}