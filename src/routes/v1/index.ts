import express from 'express';
import authRoute from './auth.route';
import utilsRoute from './utils.route';
const router = express.Router();
const routes = [
    {
        path: '/auth',
        router: authRoute,
    },
    {
        path: '/utils',
        router: utilsRoute,
    },
];

for (const route of routes) {
    router.use(route.path, route.router);
}

export default router;
