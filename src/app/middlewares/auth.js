import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  // Destructuring: using only the second element from the array
  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    // Pass user id obtained on the token to the next middlewares
    req.userId = decoded.userid;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
