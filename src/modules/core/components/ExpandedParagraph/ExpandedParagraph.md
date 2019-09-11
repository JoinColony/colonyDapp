The ExpandedParagraph component just renders a basic paragraph, that when there's too much text shortens the text paragraph and shows a more button to extend the paragraph.

```js static

const p = 'Hello to the world, this is a huughe paragraph that we might not have space for.';
<ExpandedParagraph paragraph={p} characterLimit={10} maximumCharacters={20} />

```
