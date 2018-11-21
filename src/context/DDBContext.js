/* @flow */

import { DDB, SCHEMAS } from '../lib/database';

DDB.registerSchema('userProfile', SCHEMAS.UserProfile);
DDB.registerSchema('colony', SCHEMAS.Colony);

export default DDB;
