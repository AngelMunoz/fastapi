import fastify from 'fastify';
import sensible from 'fastify-sensible';
import database from './plugins/database.js';
import { authRoutes } from './auth.js'
import { jwt } from './plugins/jwt.js';
import { profileRoutes } from './profile.js';


const server = fastify({ logger: { level: 'debug' }, ignoreTrailingSlash: true, exposeHeadRoutes: true });

server
    .register(sensible)
    .register(database)
    .register(authRoutes)
    .register(jwt)
    .register(profileRoutes, { prefix: '/api/profiles' })


server
    .listen(process.env.PORT || 5000, "0.0.0.0")
    .then(address => server.log.info(`server listening on ${address}`))
    .catch(error => {
        server.log.error(error.message, error);
        process.exit(1)
    });