
Simple `p` component that renders content as it's intended to be formatted.

```tsx
import Heading from '../Heading';

const headingAppearance = { margin: 'none', size: 'medium' };
const formattedText = `This
  is
    formatted
      funny.`;

<>
  <Heading appearance={headingAppearance}>Normal <code>p</code> tag:</Heading>
  <p>{formattedText}</p>
  <br />
  <Heading appearance={headingAppearance}><code>Paragraph</code> component:</Heading>
  <Paragraph>{formattedText}</Paragraph>
</>
```
