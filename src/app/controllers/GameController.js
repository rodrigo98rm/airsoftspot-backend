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
      // Check if game exists
      const gameResult = await pool.query(
        'SELECT * FROM game WHERE gameId = $1;',
        [req.params.gameId]
      );

      const game = gameResult.rows[0];

      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }

      // Check if game belongs to the user
      const adminResult = await pool.query(
        'SELECT * FROM admin INNER JOIN game ON admin.fieldId = game.fieldId WHERE gameId = $1 AND userId = $2',
        [req.params.gameId, req.userId]
      );

      const isAdmin = adminResult.rows[0];

      if (!isAdmin) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Update Game
      const insertResult = await pool.query(
        'UPDATE game SET title = $1, startDate = $2, endDate = $3, maxPlayers = $4, maxTeamSize = $5, qntMaxEquipment = $6, description = $7 WHERE gameId = $8 RETURNING *;',
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

  // Get games by field
  // Returns all games organized by a field
  async getGamesByField(req, res) {
    try {
      const selectResult = await pool.query(
        'SELECT * FROM game WHERE fieldId = $1;',
        [req.params.fieldId]
      );

      return res.json(selectResult.rows);
    } catch (error) {
      return res.status(500).send({ error: 'Error' });
    }
  }

  // Returns all games that a user will attend to
  async getGamesByUser(req, res) {
    try {
      const selectResult = await pool.query(
        'SELECT game.gameId, field.fieldId, title, startDate, endDate, maxPlayers, maxTeamSize, qntMaxEquipment, description, equipmentType, field.name, field.address, field.city, field.state, field.site FROM game INNER JOIN attend ON game.gameId = attend.gameId INNER JOIN users ON users.userId = attend.userId INNER JOIN field ON field.fieldId = game.fieldId WHERE attend.userId = $1;',
        [req.userId]
      );

      return res.json(selectResult.rows);
    } catch (error) {
      return res.status(500).send({ error: 'Error' });
    }
  }

  async getGamePlayers(req, res) {
    try {
      const selectResult = await pool.query(
        'SELECT users.userId, name, username FROM game INNER JOIN attend ON attend.gameId = game.gameId INNER JOIN users ON users.userId = attend.userId WHERE game.gameId = $1;',
        [req.params.gameId]
      );

      return res.json(selectResult.rows);
    } catch (error) {
      return res.status(500).send({ error: 'Error' });
    }
  }
}

export default new GameController();
