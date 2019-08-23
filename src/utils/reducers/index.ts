import findLast from 'lodash/findLast';

export * from './withDataRecordMap';
export { default as withDataRecordMap } from './withDataRecordMap';
export { default as withDataRecord } from './withDataRecord';

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
