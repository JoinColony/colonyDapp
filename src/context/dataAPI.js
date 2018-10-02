/* @flow */

let dataInstance: Object | void;

const dataContext: Object = {
  dataAPI: dataInstance,
  initializeData: (newDataInstance: Object) => {
    dataContext.dataAPI = newDataInstance;
  },
};

export default dataContext;
