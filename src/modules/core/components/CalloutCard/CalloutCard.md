**Description**
The CalloutCard component provides a standardsed way to display user information such as warnings.
The CalloutCard's appearance can be customized through `theme`s. The content should be provided through the appropriate props.

### Example

Here's a super simple implementation of an CalloutCard, and different examples of customisation of the content:

```jsx
import CalloutCard from '~core/CalloutCard';
import Link from '~core/Link';
import ExternalLink from '~core/ExternalLink';

const MSG = defineMessages({
warningTitle: {
  id: 'dashboard.ActionsPageFeed.ActionsPageFeedItemWithIPFS.warningTitle',
  defaultMessage: `<span>Attention.</span> `,
},
warningTextExternal: {
  id: 'dashboard.ActionsPageFeed.ActionsPageFeedItemWithIPFS.warningText',
  defaultMessage: `Unable to connect to IPFS gateway, annotations not loaded. <a>Reload to try again</a>`,
},
warningTextInternal: {
    id: 'dashboard.ActionsPageFeed.ActionsPageFeedItemWithIPFS.internalLink',
    defaultMessage: `Unable to connect to IPFS gateway, annotations not loaded. {link}`,
  },
});

 <CalloutCard
  label={...MSG.warningTitle}
  labelValues={{
    span: (chunks) => (
      <span className={styles.noIPFSLabel}>{chunks}</span>
    ),
  }}
  description={...MSG.warningTextInternal}
  descriptionValues={{
    link: (
      <Link
        to={location.pathname}
        text={MSG.internalLink}
        className={styles.link}
        onClick={() => window.location.reload(false)}
      />
    ),
  }}
/>

<CalloutCard
  label={...MSG.warningTitle}
  labelValues={{
    span: (chunks) => (
      <span className={styles.noIPFSLabel}>{chunks}</span>
    ),
  }}
  description={...MSG.warningTextExternal}
  descriptionValues={{
    a: (chunks) => <ExternalLink href="/url">{chunks}</ExternalLink>,
  }}
/>
```
