import { Client } from 'faunadb';

export default (() => {
  const STORAGE_KEY = 'dsettings';
  const decentralizedStorage = JSON.parse(
    localStorage.getItem(STORAGE_KEY) as string,
  );

  if (process.env.FAUNA_SECRET && !decentralizedStorage?.enabled) {
    return new Client({
      secret: process.env.FAUNA_SECRET || 'no-fauna-secret',
      domain: process.env.FAUNA_DOMAIN || 'db.eu.fauna.com',
    });
  }
  return {
    query: () => {},
  };
})();
