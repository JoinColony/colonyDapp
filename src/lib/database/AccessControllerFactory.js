/* @flow */

/**
 * @NOTE: The destructuring on both methods bellow is only necessary to pass
 * the whole access controller object to orbit-db
 */

export default class AccessControllerFactory {
  static async create(
    orbitdb: *,
    type: string,
    {
      controller: accessController,
      onlyDetermineAddress,
    }: { controller: *, onlyDetermineAddress?: boolean },
  ) {
    await accessController.load();
    return accessController.save({ onlyDetermineAddress });
  }

  static async resolve(
    orbitdb: *,
    accessControllerAddress: string,
    { controller: accessController }: { controller: * },
  ) {
    await accessController.load();
    return accessController;
  }
}
