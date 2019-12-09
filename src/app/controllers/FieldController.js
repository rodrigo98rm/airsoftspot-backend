import * as Yup from 'yup';
import pool from '../../config/db';

const ADMIN = 1;
const MODERATOR = 2;

const schema = Yup.object().shape({
  name: Yup.string().required(),
  address: Yup.string().required(),
  about: Yup.string().required(),
  site: Yup.string().required(),
});

class FieldController {
  async createField(req, res) {
    // Body validation
    try {
      schema.validateSync(req.body);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    const { name, address, about, site } = req.body;

    try {
      const resultField = await pool.query(
        'INSERT INTO field (name, address, about, site) VALUES ($1, $2, $3, $4) RETURNING *;',
        [name, address, about, site]
      );

      const field = resultField.rows[0];
      const fieldId = field.fieldid;

      const resultAdmin = await pool.query(
        'INSERT INTO admin (userId, fieldId, role) VALUES ($1, $2, $3) RETURNING *',
        [req.userId, fieldId, ADMIN]
      );
      return res.json(resultAdmin.rows);
    } catch (error) {
      return res.status(500).send({ error: 'Error' });
    }
  }

  async updateField(req, res) {
    // Body validation
    try {
      schema.validateSync(req.body);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    const { name, address, about, site } = req.body;

    try {
      // Check if field belongs to the user
      const adminResult = await pool.query(
        'SELECT * FROM admin WHERE userId = $1 AND fieldId = $2;',
        [req.userId, req.params.fieldId]
      );

      const isAdmin = adminResult.rows[0];

      if (!isAdmin) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const result = await pool.query(
        'UPDATE field SET name = $2, address = $3, about = $4, site = $5 WHERE fieldId = $1 RETURNING *',
        [req.params.fieldId, name, address, about, site]
      );

      return res.json(result.rows);
    } catch (error) {
      return res.status(500).send({ error: 'Error' });
    }
  }

  async getField(req, res) {
    try {
      const result = await pool.query(
        'SELECT * FROM field WHERE fieldId = $1',
        [req.params.fieldId]
      );

      if (result.rows[0]) {
        return res.json(result.rows[0]);
      }

      return res.status(404).json({ error: 'Field not found' });
    } catch (error) {
      return res.status(500).send({ error: 'Error' });
    }
  }
}

export default new FieldController();
