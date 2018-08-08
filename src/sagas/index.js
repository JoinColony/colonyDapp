import data from './dataSagas';

export default function* rootSaga() {
  yield [data()];
}
