/* eslint import/prefer-default-export: 0 */

const USER_PREFIX = '@';
const ENS_DOMAIN_REGEX = '^([A-Za-z0-9](?:[A-Za-z0-9-.]{0,255}[A-Za-z0-9])?)';

export const USERNAME_SCHEMA = {
  prefix: USER_PREFIX,
  name: 'username',
  schema: {
    validate(text: any, pos: any, self: any) {
      const tail = text.slice(pos);
      const usernameRegex =
        self.re.username ||
        new RegExp(`${ENS_DOMAIN_REGEX}(?=$|${self.re.src_ZPCc})`);
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
