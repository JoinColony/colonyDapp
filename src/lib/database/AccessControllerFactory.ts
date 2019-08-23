/**
 * @NOTE: The destructuring on both methods bellow is only necessary to pass
 * the whole access controller object to orbit-db
 */

export default class AccessControllerFactory {
  static async create(
    orbitdb: any,
    type: string,
    {
      controller: accessController,
      onlyDetermineAddress,
    }: { controller: any; onlyDetermineAddress?: boolean },
  ) {
    await accessController.load();
    return accessController.save({ onlyDetermineAddress });
  }

  static async resolve(
    orbitdb: any,
    accessControllerAddress: string,
    { controller: accessController }: { controller: any },
  ) {
    await accessController.load();
    return accessController;
  }
}
