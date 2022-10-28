import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import {
  getAnnotationMsgFromResponse,
  getEventMetadataVersion,
} from '@colony/colony-event-metadata-parser';

import Comment, { Props as CommentProps } from '~core/Comment';
import CalloutCard from '~core/CalloutCard';
import Link from '~core/Link';

import { useDataFetcher } from '~utils/hooks';
import { ipfsDataFetcher } from '../../../../core/fetchers';

import styles from './ActionsPageFeedItemWithIPFS.css';

const displayName = 'dashboard.ActionsPageFeed.ActionsPageFeedItemWithIPFS';

const MSG = defineMessages({
  warningTitle: {
    id: 'dashboard.ActionsPageFeed.ActionsPageFeedItemWithIPFS.warningTitle',
    defaultMessage: `<span>Attention.</span> `,
  },
  warningText: {
    id: 'dashboard.ActionsPageFeed.ActionsPageFeedItemWithIPFS.internalLink',
    defaultMessage: `Unable to connect to IPFS gateway, annotations not loaded. {link}`,
  },
  reloadLink: {
    id: 'dashboard.ActionsPageFeed.ActionsPageFeedItemWithIPFS.internalLink',
    defaultMessage: `Reload to try again`,
  },
});
interface Props extends CommentProps {
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

  const annotationMessage = useMemo(() => {
    if (!annotation || !ipfsDataJSON) {
      return undefined;
    }
    try {
      const metadataVersion = getEventMetadataVersion(ipfsDataJSON);
      if (metadataVersion === 1) {
        /*
         * original metadata format
         */
        const annotationObject = JSON.parse(ipfsDataJSON);
        if (annotationObject?.annotationMessage) {
          return annotationObject.annotationMessage;
        }
      } else {
        /*
         * new metadata format
         */
        return getAnnotationMsgFromResponse(ipfsDataJSON);
      }
    } catch (error) {
      // silently fail
    }
    return undefined;
  }, [annotation, ipfsDataJSON]);

  const location = useLocation();
  // trouble connecting to IPFS
  if (!ipfsDataJSON) {
    return (
      <CalloutCard
        label={MSG.warningTitle}
        labelValues={{
          span: (chunks) => (
            <span className={styles.noIPFSLabel}>{chunks}</span>
          ),
        }}
        description={MSG.warningText}
        descriptionValues={{
          link: (
            <Link
              to={location.pathname}
              text={MSG.reloadLink}
              className={styles.link}
              onClick={() => window.location.reload()}
            />
          ),
        }}
      />
    );
  }

  /*
   * This means that the annotation object is in a format we don't recognize
   */
  if (annotation && !annotationMessage) {
    return null;
  }

  return (
    <Comment
      {...rest}
      comment={annotation ? annotationMessage : comment}
      annotation={annotation}
      disableHover
    />
  );
};

ActionsPageFeedItemWithIPFS.displayName = displayName;

export default ActionsPageFeedItemWithIPFS;
