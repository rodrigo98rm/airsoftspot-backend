import * as Yup from 'yup';
import pool from '../../config/db';

const ADMIN = 1;
const MODERATOR = 2;

const schema = Yup.object().shape({
  name: Yup.string().required(),
  address: Yup.string().required(),
  city: Yup.string().required(),
  state: Yup.string().required(),
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

    const { name, address, city, state, about, site } = req.body;

    try {
      const resultField = await pool.query(
        'INSERT INTO field (name, address, city, state, about, site) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;',
        [name, address, city, state, about, site]
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

    const { name, address, city, state, about, site } = req.body;

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
        'UPDATE field SET name = $2, address = $3, city = $4, state = $5, about = $6, site = $7 WHERE fieldId = $1 RETURNING *',
        [req.params.fieldId, name, address, city, state, about, site]
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

  async getAllFields(req, res) {
    const { name = '', city = '', state = '' } = req.query;

    try {
      // TODO: Order by rating
      const result = await pool.query(
        'SELECT name, address, city, state, about, site, AVG(rating.rating) FROM field INNER JOIN rating ON field.fieldId = rating.fieldId WHERE UPPER(name) LIKE UPPER($1) AND UPPER(city) LIKE UPPER($2) AND UPPER(state) LIKE UPPER($3) GROUP BY name, address, city, state, about, site ORDER BY avg DESC;',
        [`%${name}%`, `%${city}%`, `%${state}%`]
      );

      return res.json(result.rows);
    } catch (error) {
      return res.status(500).send({ error: 'Error' });
    }
  }
}

export default new FieldController();
