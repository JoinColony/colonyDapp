import { build } from '@jackfranklin/test-data-bot';

export const buildUser = build('User', {
  fields: {
    username: `user${Math.round(Math.random() * 1000)}`,
  },
});
