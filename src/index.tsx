import 'babel-polyfill'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { getData } from 'src/data/api'

Promise.all([
  getData({ symbol: 'VTI' }),
  getData({ symbol: 'VXUS' }),
  getData({ symbol: 'VNQ' }),
  getData({ symbol: 'BND' }),
]).then(results => {
  console.log(results)
  const App = (): JSX.Element => <div>Hello</div>
  ReactDOM.render(<App />, document.getElementById('root'))
})
