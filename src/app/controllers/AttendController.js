import * as Yup from 'yup';
import pool from '../../config/db';

const schema = Yup.object().shape({
  equipmentType: Yup.mixed()
    .oneOf([1, 2])
    .required(),
});

class AttendController {
  async createAttend(req, res) {
    const { equipmentType } = req.body;

    // Body validation
    try {
      schema.validateSync(req.body);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    try {
      // Check if game exists
      const gameResult = await pool.query(
        'SELECT * FROM game WHERE gameId = $1;',
        [req.params.gameId]
      );

      const game = gameResult.rows[0];

      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }

      // Register user as game participant
      const insertResult = await pool.query(
        'INSERT INTO attend (userId, gameId, equipmentType) VALUES ($1, $2, $3) RETURNING *;',
        [req.userId, req.params.gameId, equipmentType]
      );
      return res.json(insertResult.rows);
    } catch (error) {
      return res.status(500).send({ error: 'Error' });
    }
  }
}

export default new AttendController();
