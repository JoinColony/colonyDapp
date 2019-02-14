
```jsx
const nowDate = new Date();
const twoDaysAgoDate = new Date();
twoDaysAgoDate.setDate(twoDaysAgoDate.getDate() - 2);
<div>
  <TimeRelative value={nowDate} />
  <br />
  <TimeRelative value={twoDaysAgoDate} />
</div>
```
