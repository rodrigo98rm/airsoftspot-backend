import 'dotenv/config';
import express from 'express';
import routes from './routes';

const path = require('path');

const cors = require('cors');

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(cors());
    this.server.use(express.json());
  }

  routes() {
    this.server.use('/', express.static(path.join(__dirname, 'public')));
    this.server.use(
      '/login',
      express.static(path.join(__dirname, 'public', 'login.html'))
    );
    this.server.use(
      '/cadastro',
      express.static(path.join(__dirname, 'public', 'cadastro.html'))
    );
    this.server.use(
      '/campo',
      express.static(path.join(__dirname, 'public', 'campo.html'))
    );
    this.server.use(
      '/cadastro-campo',
      express.static(path.join(__dirname, 'public', 'cadastro-campo.html'))
    );
    this.server.use('/api', routes);
  }
}

export default new App().server;
