import { sign, verify } from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

const jwtSecret = process.env.JWT_SECRET || 'secret';

export const jwtService = {
  createJWT: async (userId: ObjectId): Promise<string> => {
    return sign({ userId }, jwtSecret, { expiresIn: '1h' });
  },

  getUSerIdByToken: async (accessToken: string): Promise<ObjectId | null> => {
    try {
      const result = verify(accessToken, jwtSecret) as { userId: ObjectId };

      return result.userId;
    } catch (error) {
      return null;
    }
  },
};
