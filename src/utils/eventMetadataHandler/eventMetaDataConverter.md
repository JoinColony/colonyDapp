
- Example of how the data looks:

```
{
  "version": 2,
  "name": "colony",
  "data": {
    "colonyDisplayName": "...",
    "colonyAvatarHash": "...",
    "colonyTokens": ["..."]
  }
}
```

To retrieve Colony MetaData from IPFS. (String to Object)
```
  ipfsMetadata = await ipfs.getString(ipfsHash);
  const colonyMetadata = parseEventMetadata(ipfsMetadata || '') as ColonyMetadata;
```

- To retrieve colonyAvatarHash from IPFS. (String to image)
```
  response = await ipfs.getString(colonyMetadata.colonyAvatarHash);
  avatarObject = { image: getColonyAvatarImage(response || '') || null };
```
or
```
 if (avatarHash) {
        let response: string | null = null;
        try {
          response = await ipfs.getString(avatarHash);
          if (response) {
            avatarObject =
              metadataVersion === 1
                ? JSON.parse(response) // original metadata format
                : { image: getColonyAvatarImage(response) }; // new metadata format
            console.log(`🚀 ~ avatarObject`, avatarObject);
          }
        } catch (error) {
          log.verbose('Could not fetch colony avatar', response);
          log.verbose(
            `Could not parse IPFS avatar for colony:`,
            ensName,
            'with hash:',
            avatarHash,
          );
        }
      }
```




To send to IPFS. (Object to String)
```
 const annotationMetadata = getMetadataStringForAnnotation({
    annotationMsg: annotationMessage,
  });
  ipfsHash = yield call(ipfsUpload, annotationMetadata);
```
