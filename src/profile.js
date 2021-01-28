import { Collections } from './constants.js';

/**
 * 
 * @param {import('fastify').FastifyInstance} fastify 
* @param {*} options 
 */
export async function profileRoutes(fastify, options) {
    const users = fastify.mongo.db.collection(Collections.users);
    const profiles = fastify.mongo.db.collection(Collections.profiles);
    /**
     * 
     * @param {import('fastify').FastifyRequest & { jwt: Record<string, any>}} request 
     * @param {import('fastify').FastifyReply} reply
     */
    async function me(request, reply) {
        const user = await users.findOne({ email: request.jwt.user }, { projection: { email: 1, lastName: 1, name: 1 } });
        const profile = await profiles.findOne({ user: user._id });
        return { profile, ...user, token: { ...request.jwt } };
    }

    fastify.get('/me', me);
}