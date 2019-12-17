import { getFunctions } from '@/services/api';

export default {
  namespace: 'flow',

  state: {
    elc_functions: {},
    current_graph: {},
  },

  effects: {
    *fetchFunctions(_, { call, put }) {
      const response = yield call(getFunctions);
      try {
        yield put({
          type: 'saveFunctions',
          payload: response,
        });
      } catch (e) {
        console.log(e);
      }
    },
  },

  reducers: {
    saveFunctions(state, { payload }) {
      return {
        ...state,
        elc_functions: payload.result,
      };
    },
    clear() {
      return {};
    },
  },
};
