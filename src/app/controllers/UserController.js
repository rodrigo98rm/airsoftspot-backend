import bcrypt from 'bcryptjs';
import pool from '../../config/db';

class UserController {
  async createUser(req, res) {
    const { cpf, name, email, password, birth, username, address } = req.body;

    // Check if email address already exists
    let emailCount;
    try {
      const query = await pool.query(
        'SELECT COUNT(*) FROM users WHERE email = $1;',
        [email]
      );
      emailCount = query.rows[0].count;
    } catch (error) {
      return res.status(500).send({ error: 'Error' });
    }

    if (emailCount > 0) {
      return res.status(400).send({ error: 'Email já cadastrado' });
    }

    const passwordHash = await bcrypt.hash(password, 8);

    try {
      const results = await pool.query(
        'INSERT INTO users (cpf, name, email, password, birth, username, address) VALUES ($1, $2, $3, $4, $5, $6, $7);',
        [cpf, name, email, passwordHash, birth, username, address]
      );
      return res.json(results.rows);
    } catch (error) {
      return res.status(500).send({ error: 'Error' });
    }
  }

  async updateUser(req, res) {
    // Email and username cannot be updated
    const { cpf, name, password, birth, address } = req.body;

    const passwordHash = await bcrypt.hash(password, 8);

    try {
      const results = await pool.query(
        'UPDATE users SET cpf = $2, name = $3, password = $4, birth = $5, address = $6 WHERE userId = $1 ;',
        [req.userId, cpf, name, passwordHash, birth, address]
      );
      return res.json(results.rows);
    } catch (error) {
      return res.status(500).send({ error: 'Error' });
    }
  }

  async getUserById(req, res) {
    pool.query(
      'SELECT userId, cpf, name, email, birth, username, address FROM users WHERE userId = $1;',
      [req.userId],
      (error, results) => {
        if (error) {
          return res.status(500).send({ error });
        }
        return res.json(results.rows[0]);
      }
    );
  }
}

export default new UserController();
