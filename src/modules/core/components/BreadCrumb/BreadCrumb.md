The BreadCrumb component just renders a basic breadCrumb style visualisation of the current state of navigation, but expects you to handle that state outside of the component and the developer to pass in an array of strings.

```js static

const elements = ["Main", "About", "Bio"];
<BreadCrumb elements={elements} />

```
