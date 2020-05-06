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
const { useState } = require('react');
import UserAvatar from '../UserAvatar';

const AvatarUploadWrapper = () => {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const uploadAvatar = (file) => {
    return new Promise(resolve => setTimeout(() => {
      setAvatarUrl(file.data);
      resolve();
    }, 3000));
  }
  const removeAvatar = () => {
    setAvatarUrl(null);
  }
  return (
    <AvatarUploader
      label="Upload your avatar!"
      placeholder={
        <UserAvatar
          avatarURL={avatarUrl}
          size="xl"
          address="0x1afb213afa8729fa7908154b90e256f1be70989a"
          user={{profile: { username: 'testuser' }}}
        />
      }
      upload={uploadAvatar}
      remove={removeAvatar}
    />
  );
}

<AvatarUploadWrapper />
```
