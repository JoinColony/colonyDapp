import { useDataFetcher } from '~utils/hooks';
import { IPFSAvatarImage } from '~types/index';

import { ipfsDataFetcher } from '../../modules/core/fetchers';
import { getColonyAvatarImage } from '~utils/eventMetadataHandler';
import { getEventMetadataVersion } from '~utils/eventMetadataHandler/helper';

const useUserAvatarImageFromIPFS = (ipfsHash: string): IPFSAvatarImage => {
  let avatarObject: IPFSAvatarImage = { image: undefined };
  const { data: avatar } = useDataFetcher(
    ipfsDataFetcher,
    [ipfsHash],
    [ipfsHash],
  );

  try {
    const metadataVersion = getEventMetadataVersion(avatar);
    console.log(
      `🚀 ~useUserAvatarImageFromIPFS metadataVersion`,
      metadataVersion,
    );
    avatarObject =
      metadataVersion === 1
        ? JSON.parse(avatar) // original metadata format
        : { image: getColonyAvatarImage(avatar) }; // new metadata format
    console.log(`🚀 ~ avatarObject`, avatarObject);
    // avatarObject = JSON.parse(avatar);
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
