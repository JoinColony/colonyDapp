/* @flow */
// eslint-disable-next-line import/no-anonymous-default-export, import/prefer-default-export
export function queryEventCollection(db, filter = {}) {
  return db
    .iterator(filter)
    .collect()
    .reduce(
      (events, event) => [
        ...events,
        ...((event &&
          event.next &&
          event.next.length &&
          event.next.map(hash => db.get(hash))) ||
          []),
        event,
      ],
      [],
    );
}

// todo
export const getDomainStore = () => {};
