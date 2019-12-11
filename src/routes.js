import { Router } from 'express';

// Controllers
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import FieldController from './app/controllers/FieldController';
import RatingController from './app/controllers/RatingController';
import GameController from './app/controllers/GameController';
import AttendController from './app/controllers/AttendController';

// Middlewares
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.get('/', (req, res) => {
  res.send(`AirsoftSpot V${process.env.VERSION} - ${process.env.NODE_ENV}`);
});

// Session
routes.post('/session', SessionController.store);

// Users
routes.post('/users', UserController.createUser);

// Fields
routes.get('/field', FieldController.getAllFields);
routes.get('/field/:fieldId', FieldController.getField);

// Rating
routes.get('/rating/:fieldId', RatingController.getRatingsByField);

// Games
routes.get('/game/:fieldId', GameController.getGamesByField);
routes.get('/game/:gameId/players', GameController.getGamePlayers);

// #####################################################
// Define auth middleware for all routes below this line
// #####################################################
routes.use(authMiddleware);

// Users
routes.get('/users', UserController.getUserById);
routes.put('/users', UserController.updateUser);

// Fields
routes.post('/field', FieldController.createField);
routes.put('/field/:fieldId', FieldController.updateField);

// Ratings
routes.post('/rating/:fieldId', RatingController.createRating);
routes.get('/rating', RatingController.getRatingsByUser);

// Games
routes.post('/game/:fieldId', GameController.createGame);
routes.put('/game/:gameId', GameController.updateGame);
routes.get('/game', GameController.getGamesByUser);

// Attend
routes.post('/attend/:gameId', AttendController.createAttend);

export default routes;
