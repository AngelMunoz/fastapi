import bcryptjs from 'bcryptjs';
import jwtService from 'jsonwebtoken';
import { Collections, JWT_SECRET } from './constants.js';

/**
 * 
 * @param {import('fastify').FastifyInstance} fastify 
* @param {*} options 
 */
export async function authRoutes(fastify, options) {
    const users = fastify.mongo.db.collection(Collections.users);

    /**
     * 
     * @param {string} email 
     */
    function exists(email) {
        return users.countDocuments({ email: email.toLowerCase() }).then(result => result > 0);
    }

    /**
     * 
     * @param {string} email 
     */
    function signToken(email) {
        return jwtService.sign({ user: email }, JWT_SECRET, { expiresIn: '1d' });
    }


    fastify.addHook('preValidation', async function(request, reply) {
        if (!request.body) { throw fastify.httpErrors.badRequest('missing body on the request'); }
    });
    /**
     * 
     * @param {import('fastify').FastifyRequest<any>} request 
     * @param {import('fastify').FastifyReply<any>} reply
     */
    async function login(request, reply) {
        const { email, password } = request.body;
        if (!email || !password) { throw fastify.httpErrors.badRequest('missing body on the request'); }

        try {
            var user = await users.findOne({ email: request.body.email }, { projection: { email: 1, password: 1 } })
            if (!user) { throw fastify.httpErrors.badRequest('Invalid credentials'); }
        } catch (error) {
            fastify.log.warn('Failed to find users', error)
            throw fastify.httpErrors.badRequest('Invalid credentials');
        }

        try {
            const isValid = await bcryptjs.compare(password, user.password);
            if (!isValid) { throw fastify.httpErrors.badRequest('Invalid credentials'); }
            const token = signToken(email)
            return { user: email, token }
        } catch (error) {
            fastify.log.info('failed to login', error)
            throw fastify.httpErrors.badRequest('Invalid credentials');
        }
    }

    /**
     * 
     * @param {import('fastify').FastifyRequest<any>} request 
     * @param {import('fastify').FastifyReply} reply
     */
    async function signup(request, reply) {
        const { email, password, ...userInfo } = request.body;
        if (!email || !password) { throw fastify.httpErrors.badRequest('missing email or password on the request'); }

        const userExists = await exists(email);
        if (userExists) { throw fastify.httpErrors.badRequest('Email already exists'); }
        try {
            const hash = await bcryptjs.hash(password, 12);
            var result = await users.insertOne({ ...userInfo, email, password: hash });
            if (!result.result.ok) {
                throw new Error('User not created');
            }
        } catch (error) {
            fastify.log.error('Failed to create user', error);
            throw fastify.httpErrors.internalServerError('Failed to create user')
        }
        const token = signToken(email);
        return { user: email, token };
    }

    fastify.post('/auth/login', login);
    fastify.post('/auth/signup', signup);
}