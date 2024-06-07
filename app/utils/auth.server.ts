const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = "your-secret-key"; // Keep this safe!

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword);
}

export function createToken(userId: string) {
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: '1h' });
}

export function verifyToken(token: string) {
  return jwt.verify(token, SECRET_KEY);
}
