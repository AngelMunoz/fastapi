import fastifyPlugin from 'fastify-plugin';
import jwtService from 'jsonwebtoken';
import { JWT_SECRET } from '../constants.js';


/**
 * 
 * @param {import('fastify').FastifyInstance} fastify 
 * @param {*} options
 */
export async function jwt(fastify, options) {
    fastify.decorateRequest('jwt', null)
    fastify.addHook('onRequest', async function(request, reply) {
        if (!request.url.startsWith('/api')) return;

        if (!request.headers || !request.headers.authorization) {
            throw fastify.httpErrors.unauthorized();
        }
        const [bearer, token] = request.headers.authorization.split(' ');
        if (bearer !== 'Bearer' || !token) {
            throw fastify.httpErrors.unauthorized();
        }
        try {
            const decoded = jwtService.verify(token, JWT_SECRET)
            //@ts-ignore
            request.jwt = { ...decoded };
        } catch (err) {
            fastify.log.info('JWT Error', err);
            throw fastify.httpErrors.forbidden();
        }
    });
}
export default fastifyPlugin(jwt)