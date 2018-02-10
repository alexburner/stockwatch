import 'babel-polyfill'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

const App = (): JSX.Element => <div>Hello</div>

ReactDOM.render(<App />, document.getElementById('root'))
