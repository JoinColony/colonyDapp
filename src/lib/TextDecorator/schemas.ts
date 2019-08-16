/* eslint import/prefer-default-export: 0 */

import { ENS_DOMAIN_REGEX } from '../../modules/validations';

const USER_PREFIX = '@';

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
