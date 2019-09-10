### A simple AvatarUploader

This AvatarUploader has a fake upload function that does nothing except for waiting for 5 seconds.

```js
import UserAvatar from '../UserAvatar';

// Let's create a fake upload function
const upload = (file) => new Promise(resolve => setTimeout(resolve, 3000));

<AvatarUploader
  label="Upload your avatar!"
  help="(It must be at least 250px by 250px)"
  placeholder={
    <UserAvatar
      size="xl"
      address="0x1afb213afa8729fa7908154b90e256f1be70989a"
      user={{profile: { username: 'testuser' }}}
    />
  }
  upload={upload}
  remove={() => {}}
/>
```

### Set and remove the `avatarURL` from outside

Here we passing the result of the upload process (in this case the avatarURL) back into the uploader. Normally this would be done via a database or IPFS.

```js
const { Component } = require('react');
import UserAvatar from '../UserAvatar';

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
        label="Upload your avatar!"
        placeholder={
          <UserAvatar
            avatarURL={this.state.avatarURL}
            size="xl"
            address="0x1afb213afa8729fa7908154b90e256f1be70989a"
            user={{profile: { username: 'testuser' }}}
          />
        }
        upload={this.uploadAvatar}
        remove={this.removeAvatar}
      />
    );
  }
}

<AvatarUploadWrapper />
```
