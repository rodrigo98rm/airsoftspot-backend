import { Router } from 'express';

// Controllers
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';

// Middlewares
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// Session
routes.post('/session', SessionController.store);

// Users
routes.post('/users', UserController.createUser);

// Define auth middleware for all routes below this line
routes.use(authMiddleware);

routes.get('/users', UserController.getUserById);
routes.put('/users', UserController.updateUser);

export default routes;
