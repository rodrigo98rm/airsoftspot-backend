import * as Yup from 'yup';
import pool from '../../config/db';

const schema = Yup.object().shape({
  rating: Yup.number()
    .min(1)
    .max(5)
    .required(),
  review: Yup.string().notRequired(),
});

class RatingController {
  async createRating(req, res) {
    // Body validation
    try {
      schema.validateSync(req.body);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    const { rating, review } = req.body;

    try {
      // Check if field exists
      const fieldResult = await pool.query(
        'SELECT * FROM field WHERE fieldId = $1;',
        [req.params.fieldId]
      );

      const field = fieldResult.rows[0];

      if (!field) {
        return res.status(404).json({ error: 'Field not found' });
      }

      const insertResult = await pool.query(
        'INSERT INTO rating (userId, fieldId, rating, review) VALUES ($1, $2, $3, $4) RETURNING *',
        [req.userId, req.params.fieldId, rating, review]
      );

      return res.json(insertResult.rows);

      // Insert into rating table
    } catch (error) {
      return res.status(500).send({ error: 'Error' });
    }
  }

  async getRatingsByField(req, res) {
    try {
      const selectResult = await pool.query(
        'SELECT name, rating, review, rating.createdAt FROM rating INNER JOIN users ON rating.userId = users.userId WHERE fieldId = $1 ORDER BY rating.createdAt DESC;',
        [req.params.fieldId]
      );

      return res.json(selectResult.rows);
    } catch (error) {
      return res.status(500).send({ error: 'Error' });
    }
  }

  async getRatingsByUser(req, res) {
    try {
      const selectResult = await pool.query(
        'SELECT field.fieldId, name, rating, review, rating.createdAt FROM rating INNER JOIN field ON field.fieldId = rating.fieldId WHERE rating.userId = $1 ORDER BY rating.createdAt DESC;',
        [req.userId]
      );

      return res.json(selectResult.rows);
    } catch (error) {
      return res.status(500).send({ error: 'Error' });
    }
  }
}

export default new RatingController();
