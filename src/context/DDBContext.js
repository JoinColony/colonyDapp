/* @flow */

import { DDB, SCHEMAS } from '../lib/database';

DDB.registerSchema('userProfile', SCHEMAS.UserProfile);
DDB.registerSchema('userActivity', SCHEMAS.UserActivity);

export default DDB;
