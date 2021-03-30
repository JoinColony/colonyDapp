import React, { useCallback } from 'react';

import { useDataFetcher } from '~utils/hooks';
import { ipfsDataFetcher } from '../../../../core/fetchers';

import ActionsPageFeedItem, {
  ActionsPageFeedItemProps,
} from '../ActionsPageFeedItem';

const displayName = 'dashboard.ActionsPageFeed.ActionsPageFeedItemWithIPFS';

interface Props extends ActionsPageFeedItemProps {
  hash: string;
}

const ActionsPageFeedItemWithIPFS = ({
  hash,
  annotation = false,
  comment,
  ...rest
}: Props) => {
  const { data: ipfsDataJSON } = useDataFetcher(
    ipfsDataFetcher,
    [hash],
    [hash],
  );

  const getAnnotationMessage = useCallback(() => {
    if (!annotation || !ipfsDataJSON) {
      return undefined;
    }
    const annotationObject = JSON.parse(ipfsDataJSON);
    if (annotationObject && annotationObject.annotationMessage) {
      return annotationObject.annotationMessage;
    }
    return undefined;
  }, [annotation, ipfsDataJSON]);

  const annotationMessage = getAnnotationMessage();

  /*
   * This means that the annotation object is in a format we don't recognize
   */
  if (annotation && !annotationMessage) {
    return null;
  }

  return (
    <ActionsPageFeedItem
      {...rest}
      comment={annotation ? annotationMessage : comment}
      annotation={annotation}
    />
  );
};

ActionsPageFeedItemWithIPFS.displayName = displayName;

export default ActionsPageFeedItemWithIPFS;
