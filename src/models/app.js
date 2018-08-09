export default {
  namespace: 'app',
  state: {
    formData: ''
  },
  subscriptions: {},
  effects: {},
  reducers: {
    formData(state, action) {
      return {
        ...state,
        formData: action.payload,
      }
    }
  }
}
