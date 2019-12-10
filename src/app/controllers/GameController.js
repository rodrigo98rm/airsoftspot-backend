import * as Yup from 'yup';
import pool from '../../config/db';

const schema = Yup.object().shape({
  title: Yup.string().required(),
  startDate: Yup.date()
    .min(new Date(), 'Data/horário de início inválidos.')
    .required(),
  endDate: Yup.date()
    .min(new Date(), 'Data/horário de fim inválidos.')
    .required(),
  maxPlayers: Yup.number().required(),
  maxTeamSize: Yup.number().required(),
  qntMaxEquipment: Yup.number().required(),
  description: Yup.string().required(),
});

class GameController {
  async createGame(req, res) {
    // Body validation
    try {
      schema.validateSync(req.body);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    const {
      title,
      startDate,
      endDate,
      maxPlayers,
      maxTeamSize,
      qntMaxEquipment,
      description,
    } = req.body;

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

      // Check if field belongs to the user
      const adminResult = await pool.query(
        'SELECT * FROM admin WHERE userId = $1 AND fieldId = $2;',
        [req.userId, req.params.fieldId]
      );

      const isAdmin = adminResult.rows[0];

      if (!isAdmin) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Create Game
      const insertResult = await pool.query(
        'INSERT INTO game (fieldId, title, startDate, endDate, maxPlayers, maxTeamSize, qntMaxEquipment, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;',
        [
          req.params.fieldId,
          title,
          startDate,
          endDate,
          maxPlayers,
          maxTeamSize,
          qntMaxEquipment,
          description,
        ]
      );

      return res.json(insertResult.rows);
    } catch (error) {
      return res.status(500).send({ error: 'Error' });
    }
  }

  async updateGame(req, res) {
    // Body validation
    try {
      schema.validateSync(req.body);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    const {
      title,
      startDate,
      endDate,
      maxPlayers,
      maxTeamSize,
      qntMaxEquipment,
      description,
    } = req.body;

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

      // Check if field belongs to the user
      const adminResult = await pool.query(
        'SELECT * FROM admin WHERE userId = $1 AND fieldId = $2;',
        [req.userId, req.params.fieldId]
      );

      const isAdmin = adminResult.rows[0];

      if (!isAdmin) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Update Game
      const insertResult = await pool.query(
        'UPDATE game SET title = $1, startDate = $2, endDate = $3, maxTeamSize = $4, qntMaxEquipment = $5, description = $6 WHERE gameId = $7 RETURNING *;',
        [
          title,
          startDate,
          endDate,
          maxPlayers,
          maxTeamSize,
          qntMaxEquipment,
          description,
          req.params.gameId,
        ]
      );

      return res.json(insertResult.rows);
    } catch (error) {
      return res.status(500).send({ error: 'Error' });
    }
  }
}

export default new GameController();
