### A Simple Card List

#### Auto-Wrapping

By default, the cards will automatically wrap as they need to, and they'll match heights on a per-row basis. Resize your browser to see this behavior in action.

```jsx
import Card from '../Card';

const cardContentData = [
  { id: 1, heading: 'Normal Card', content: 'Some content' },
  { id: 2, heading: 'Tall Card', content: 'Some more content', extraContent: 'Some extra content to demonstrate matching heights' },
  { id: 3, heading: 'Normal Card', content: 'Some content' },
  { id: 4, heading: 'Normal Card', content: 'Some content' },
  { id: 5, heading: 'Normal Card', content: 'Some content' },
  { id: 6, heading: 'Normal Card', content: 'Some content' },
  { id: 7, heading: 'Normal Card', content: 'Some content' },
];
<CardList>
  {cardContentData.map(({ id, heading, content, extraContent }) => (
    <Card key={id}>
      <p><strong>{heading}</strong></p>
      <p>{content}</p>
      {extraContent && (
        <p>{extraContent.split(' ').map(word => (<span key={word}>{word}<br/></span>))}</p>
      )}
    </Card>
  ))}
</CardList>
```
