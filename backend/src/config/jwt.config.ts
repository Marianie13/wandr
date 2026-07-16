export const jwtConfig = {
  secret: (process.env.JWT_SECRET || 'wandr-secret-dev') as string,
  expiresIn: '24h',
  refreshExpiresIn: '7d'
}