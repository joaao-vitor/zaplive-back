import express from 'express';
import authRouter from './auth.route';
import utilsRouter from './utils.route';
import userRouter from './user.route';
const router = express.Router();
const routes = [
    {
        path: '/auth',
        router: authRouter,
    },
    {
        path: '/utils',
        router: utilsRouter,
    },
    {
        path: '/user',
        router: userRouter,
    },
];

for (const route of routes) {
    router.use(route.path, route.router);
}

export default router;
