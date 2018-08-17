
### Simple CardList

```jsx
const cardContentData = [
  { heading: 'Heading 1', content: 'Content 1' },
  { heading: 'Heading 2', content: 'Content 2', extraContent: 'Some extra content' },
];
const CardContentItem = ({heading, content, extraContent}) => (
  <div>
    <p><strong>{heading}</strong></p>
    <p>{content}</p>
    {extraContent &&
      <p>{extraContent}</p>
    }
  </div>
);
<CardList cardContentItems={cardContentData} cardItemComponent={CardContentItem} />
```
