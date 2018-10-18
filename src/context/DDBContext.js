/* @flow */

import { DDB, SCHEMAS } from '../lib/database';

DDB.registerSchema('userProfile', SCHEMAS.UserProfile);

export default DDB;
