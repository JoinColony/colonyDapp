import {
  getColonyAvatarImage,
  getEventMetadataVersion,
} from '@colony/colony-event-metadata-parser';

import { useDataFetcher } from '~utils/hooks';
import { IPFSAvatarImage } from '~types/index';

import { ipfsDataFetcher } from '../../modules/core/fetchers';

const useUserAvatarImageFromIPFS = (ipfsHash: string): IPFSAvatarImage => {
  let avatarObject: IPFSAvatarImage = { image: undefined };
  const { data: avatar } = useDataFetcher(
    ipfsDataFetcher,
    [ipfsHash],
    [ipfsHash],
  );

  if (!avatar) return avatarObject;
  try {
    const metadataVersion = getEventMetadataVersion(avatar);
    avatarObject =
      metadataVersion === 1
        ? JSON.parse(avatar) // original metadata format
        : { image: getColonyAvatarImage(avatar) }; // new metadata format
  } catch (error) {
    /*
     * @NOTE Silent error
     * Most users won't have an avatar, so this will get triggered quite a lot
     * and that's ok, it's expected
     */
  }
  return avatarObject;
};

export default useUserAvatarImageFromIPFS;
