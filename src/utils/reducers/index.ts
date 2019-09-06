import findLast from 'lodash/findLast';

export * from './withFetchableDataMap';
export { default as withFetchableDataMap } from './withFetchableDataMap';
export { default as withFetchableData } from './withFetchableData';

export const reduceToLastState = (events: any[], getKey, getValue) =>
  Array.from(
    events.reduceRight((map, event) => {
      const key = getKey(event);
      if (!map.has(key)) {
        map.set(key, getValue(event));
      }
      return map;
    }, new Map()),
  );

export const getLast = findLast;
