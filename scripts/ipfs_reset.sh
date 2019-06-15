#!/usr/bin/env bash

echo "Removing IPFS data..."

rm -rf src/lib/pinion/data-go/blocks
rm -rf src/lib/pinion/data-go/datastore
rm -rf src/lib/pinion/data-go/keystore

rm -rf src/lib/pinion/data-js/blocks
rm -rf src/lib/pinion/data-js/datastore
rm -rf src/lib/pinion/data-js/keys

echo "Removed IPFS data."
