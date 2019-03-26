/* @flow */

import { branch, lifecycle } from 'recompose';

type Props = {
  avatarData?: string,
  avatarHash?: string,
};

const shouldFetchColonyAvatar = ({ avatarHash, avatarData }: Props) =>
  !!(!avatarData && avatarHash);

const fetchMissingColonyAvatar = branch(
  shouldFetchColonyAvatar,
  lifecycle({
    componentDidMount() {
      const { avatarHash, fetchColonyAvatar } = this.props;
      if (shouldFetchColonyAvatar(this.props)) fetchColonyAvatar(avatarHash);
    },
  }),
);

export default fetchMissingColonyAvatar;
