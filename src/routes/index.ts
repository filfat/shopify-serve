import * as Home from './home';

import type Express from 'express';

const routes = (app: Express.Application) => {
    app.get('/', Home.get);
};

export default routes;
