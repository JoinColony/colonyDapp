import { Client } from 'faunadb';

export default new Client({
  secret: process.env.FAUNA_SECRET || 'no-fauna-secret',
  domain: 'db.eu.fauna.com',
});
