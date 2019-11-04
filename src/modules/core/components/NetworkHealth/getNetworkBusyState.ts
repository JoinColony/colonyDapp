import { ConnectionType } from '~immutable/index';

// true = busy, false = not busy

const storesBusyHealth = busyStores => !!busyStores.length;

const pinnerBusyHealth = pinnerBusy => pinnerBusy;

const calculateNetworkBusyState = ({
  stats: { busyStores = [], pinnerBusy = false },
}: ConnectionType) => [
  { busyState: storesBusyHealth(busyStores) },
  { busyState: pinnerBusyHealth(pinnerBusy) },
];

export default calculateNetworkBusyState;
