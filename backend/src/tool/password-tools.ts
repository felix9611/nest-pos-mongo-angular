import * as crypto from 'crypto'

export const salt = 'random_salt'

export function hashPassword(password: string, salt: string): string {
    return crypto.createHmac('sha256', salt).update(password).digest('hex');
}
  