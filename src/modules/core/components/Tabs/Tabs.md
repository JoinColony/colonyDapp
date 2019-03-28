Tabs are just a simple wrapper around [react-tabs](https://github.com/reactjs/react-tabs), which utilises our own styles. The props available for each component are mirrored here. For more documentation around this component and all the default values visit their site.

You can import Tabs into your component similarly:

`import { Tab, Tabs, TabList, VerticalTablist, TabPanel } from '../Tabs';`

### Simple Tabs example

```js
const { Tab, TabList, TabPanel } = require('.');

<Tabs>
  <TabList extra={<a href="#">I am an extra node!</a>}>
    <Tab>Cool option</Tab>
    <Tab>Cool as well</Tab>
    <Tab>More content</Tab>
    <Tab disabled>Disabled!</Tab>
  </TabList>

  <TabPanel>
    <h2>Any content 1</h2>
  </TabPanel>
  <TabPanel>
    <h2>Any content 2</h2>
  </TabPanel>
  <TabPanel>
    <h2>Any content 3</h2>
  </TabPanel>
  <TabPanel>
    <h2>This should not be visible</h2>
  </TabPanel>
</Tabs>
```

### Vertical Tabs example

*NOTE:* That the `VerticalTabList` component does not have an `extras` prop.

```js
const { Tab, VerticalTabList, TabPanel } = require('.');

const makeshiftStyles = {
  display: 'inline-block',
  verticalAlign: 'top',
};

<Tabs>
  <VerticalTabList style={makeshiftStyles}>
    <Tab>Cool option</Tab>
    <Tab>Cool as well</Tab>
    <Tab>More content</Tab>
    <Tab disabled>Disabled!</Tab>
  </VerticalTabList>

  <TabPanel style={makeshiftStyles}>
    <h2>Any content 1</h2>
  </TabPanel>
  <TabPanel style={makeshiftStyles}>
    <h2>Any content 2</h2>
  </TabPanel>
  <TabPanel style={makeshiftStyles}>
    <h2>Any content 3</h2>
  </TabPanel>
  <TabPanel style={makeshiftStyles}>
    <h2>This should not be visible</h2>
  </TabPanel>
</Tabs>
```
