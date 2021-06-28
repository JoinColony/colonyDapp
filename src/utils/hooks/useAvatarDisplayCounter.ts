import Maybe from 'graphql/tsutils/Maybe';
import { useMemo } from 'react';

const useAvatarDisplayCounter = (
  maxAvatars: number,
  members: Maybe<string[]>,
) => {
  const avatarsDisplaySplitRules = useMemo(() => {
    if (!members?.length) {
      return 0;
    }

    if (members.length <= maxAvatars) {
      return members.length;
    }

    return maxAvatars - 1;
  }, [members, maxAvatars]);

  const remainingAvatarsCount = useMemo(() => {
    if (!members?.length) {
      return 0;
    }

    if (members.length <= maxAvatars) {
      return 0;
    }
    return members.length - maxAvatars + 1;
  }, [members, maxAvatars]);

  return {
    avatarsDisplaySplitRules,
    remainingAvatarsCount,
  };
};

export default useAvatarDisplayCounter;
