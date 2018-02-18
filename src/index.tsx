import 'babel-polyfill'
import ReactEcharts from 'echarts-for-react'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { getCharts, getSymbols, TimeRange } from 'src/data/api'

const symbols = ['VTI', 'VXUS', 'VNQ', 'BND']

const option: echarts.EChartOption = {
  xAxis: {
    type: 'time',
  },
  yAxis: {
    type: 'value',
    scale: true,
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderColor: 'none',
        shadowColor: 'none',
      },
    },
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  series: [
    {
      type: 'line',
      encode: {
        x: 'date',
        y: 'close',
      },
    },
  ],
}

// getSymbols().then((results: any) => {
//   console.log(results)
// })

getCharts(symbols, TimeRange.M6).then(results => {
  console.log(results)
  ReactDOM.render(
    <div>
      {results.map((chartData, i) => (
        <ReactEcharts
          key={symbols[i]}
          option={{ ...option, dataset: { source: chartData } }}
          style={{ height: '350px', width: '100%' }}
          theme="dark"
        />
      ))}
    </div>,
    document.getElementById('root'),
  )
})
