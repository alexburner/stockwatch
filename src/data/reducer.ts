interface State {}
interface Action {
  type: string
}

export default (state: State, action: Action): State => {
  switch (action.type) {
    case '@@redux/INIT': {
      return state
    }
    default: {
      console.warn('Unhandled action:', action)
      return state
    }
  }
}
