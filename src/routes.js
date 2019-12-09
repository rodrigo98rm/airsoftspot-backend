import { Router } from 'express';

// Controllers
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import FieldController from './app/controllers/FieldController';

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
routes.get('/field/:fieldId', FieldController.getField);

// Define auth middleware for all routes below this line
routes.use(authMiddleware);

// Users
routes.get('/users', UserController.getUserById);
routes.put('/users', UserController.updateUser);

// Fields
routes.post('/field', FieldController.createField);
routes.put('/field/:fieldId', FieldController.updateField);

export default routes;
