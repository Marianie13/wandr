import { User } from '../models/user.model'

// Por ahora simulamos la BD con un array en memoria
// Cuando conectemos PostgreSQL en la Fase 10, solo cambiamos este archivo
const users: User[] = []

export const authRepository = {
  async findByEmail(email: string): Promise<User | undefined> {
    return users.find(user => user.email === email)
  },

  async findById(id: string): Promise<User | undefined> {
    return users.find(user => user.id === id)
  },

  async create(user: User): Promise<User> {
    users.push(user)
    return user
  }
}