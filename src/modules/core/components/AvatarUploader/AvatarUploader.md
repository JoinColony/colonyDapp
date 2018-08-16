### A simple AvatarUploader

This AvatarUploader has a fake upload function that does nothing except for waiting for 5 seconds.

```js

// Let's create a fake upload function
const upload = (file) => new Promise(resolve => setTimeout(resolve, 3000));

<AvatarUploader
  label="Upload your avatar!"
  placeholderIcon="circle-person"
  upload={upload}
/>
```

### Set and remove the `avatarURL` from outside

Here we passing the result of the upload process (in this case the avatarURL) back into the uploader. Normally this would be done via a database or IPFS.

```
const { Component } = require('react');

class AvatarUploadWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatarURL: null
    }
    this.uploadAvatar = this.uploadAvatar.bind(this);
    this.removeAvatar = this.removeAvatar.bind(this);
  }
  uploadAvatar(file) {
    return new Promise(resolve => setTimeout(() => {
      this.setState({
        avatarURL: file.data
      })
      resolve();
    }, 3000));
  }
  removeAvatar() {
    this.setState({
      avatarURL: null
    })
  }
  render() {
    return (
      <AvatarUploader
        avatarURL={this.state.avatarURL}
        label="Upload your avatar!"
        placeholderIcon="circle-person"
        upload={this.uploadAvatar}
        remove={this.removeAvatar}
      />
    );
  }
}

<AvatarUploadWrapper />
```


