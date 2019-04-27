#!/bin/sh

# patch until https://github.com/orbitdb/orbit-db/pull/606 is merged
patch --forward -d node_modules/orbit-db -p1 < patches/orbit-db-peer-exchanged.patch > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo 'orbit-db successfully patched'
else
  echo 'orbit-db already patched'
fi
# patch until https://github.com/orbitdb/orbit-db-store/pull/38 is merged
patch --forward -d node_modules/orbit-db-store -p1 < patches/orbit-db-store-sync.patch > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo 'orbit-db-store successfully patched'
else
  echo 'orbit-db-store already patched'
fi
