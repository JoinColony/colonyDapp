/* @flow */
/* eslint import/prefer-default-export: 0 */

const USER_PREFIX = '@';

export const USERNAME_SCHEMA = {
  prefix: USER_PREFIX,
  name: 'username',
  schema: {
    validate(text: *, pos: *, self: *) {
      const tail = text.slice(pos);
      const usernameRegex =
        self.re.username ||
        new RegExp(`^([a-z0-9_.-]*)(?=$|${self.re.src_ZPCc})`);
      if (usernameRegex.test(tail)) {
        // We additionally disable `@` ("@@mention" is invalid)
        if (tail[0] === USER_PREFIX) {
          return false;
        }
        return (tail.match(usernameRegex) || [])[0].length;
      }
      return 0;
    },
  },
};
