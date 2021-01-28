export const JWT_SECRET = process.env.JWT_KEY || 'so much secret wow :o';
export const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/fastapi'


export const Collections = Object.freeze({
    users: 'fst_users',
    profiles: 'fst_profiles'
});