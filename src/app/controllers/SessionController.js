import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import bcrypt from 'bcryptjs';
import authConfig from '../../config/auth';
import pool from '../../config/db';

class SessionController {
  async store(req, res) {
    // Validation
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const { email, password } = req.body;

    // Check if users exists
    let user;
    try {
      const query = await pool.query('SELECT * FROM users WHERE email = $1;', [
        email,
      ]);
      user = query.rows[0];
    } catch (error) {
      return res.status(500).send({ error: 'Error' });
    }

    if (!user) {
      return res.status(401).send({ error: 'Email ou senha incorretos' });
    }

    // Check if password matches
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).send({ error: 'Email ou senha incorretos' });
    }

    // Email and password are correct
    const { userid, name } = user;

    return res.json({
      user: {
        userid,
        name,
        email,
      },
      token: jwt.sign({ userid }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
