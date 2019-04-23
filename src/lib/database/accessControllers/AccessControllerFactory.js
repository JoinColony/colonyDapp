/* @flow */

/**
 * @NOTE: The destructuring on both methods bellow is only necessary to pass
 * the whole access controller object to orbit-db
 */

export default class AccessControllerFactory {
  static async create(orbitdb, type, { controller: accessController }) {
    await accessController.load();
    return accessController.save();
  }

  static async resolve(
    orbitdb,
    accessControllerAddress,
    { controller: accessController },
  ) {
    return accessController;
  }
}
