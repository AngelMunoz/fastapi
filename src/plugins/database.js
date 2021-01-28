import fastifyPlugin from 'fastify-plugin';
import fastifyMongodb from 'fastify-mongodb';
import { MONGO_URL } from '../constants.js';


/**
 * 
 * @param {import('fastify').FastifyInstance} fastify 
 * @param {*} options 
 */
async function database(fastify, options) {
    fastify.register(fastifyMongodb, {
        url: MONGO_URL
    });
}


export default fastifyPlugin(database);