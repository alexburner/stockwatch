import 'babel-polyfill'
import format from 'date-fns/format'
import ReactEcharts from 'echarts-for-react'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { ChartDatum, getCharts, getSymbols, TimeRange } from 'src/data/api'

const symbols = ['VTI', 'VXUS', 'VNQ', 'BND']

const getDotHtml = (color: string): string => `
  <span style="
      display:inline-block;
      margin-right:5px;
      border-radius:10px;
      width:10px;
      height:10px;
      background-color:${color};
  "></span>
`

const option: echarts.EChartOption = {
  xAxis: {
    type: 'time',
    show: false,
  },
  yAxis: {
    type: 'value',
    scale: true,
    show: false,
    axisPointer: {
      type: 'line',
      lineStyle: {
        opacity: 0.5,
        type: 'dotted',
      },
      label: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderColor: 'none',
        shadowColor: 'none',
        formatter({ seriesData, value }: { seriesData: any; value: number }) {
          const date = new Date(value)
          if (date.getFullYear() < 1995) return Number(value).toFixed(2)
          else return format(date, 'MMM Do YYYY')
        },
      },
    },
  },
  tooltip: {
    trigger: 'axis',
    formatter(params: any[]) {
      return params
        .map(p => {
          const label = p.seriesName
          const value = p.value[p.seriesId] // XXX codename tribeca
          const dot = getDotHtml(p.color)
          return `${dot} ${label}: ${value}`
        })
        .join('<br/>')
    },
    axisPointer: {
      type: 'cross',
      lineStyle: {
        opacity: 0.5,
      },
      label: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderColor: 'none',
        shadowColor: 'none',
        formatter({ seriesData, value }: { seriesData: any; value: number }) {
          const date = new Date(value)
          if (date.getFullYear() < 1995) return Number(value).toFixed(2)
          else return format(date, 'MMM D YYYY')
        },
      },
    },
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  series: [
    {
      id: 'high', // XXX codename tribeca
      name: 'High',
      type: 'line',
      showSymbol: false,
      encode: {
        x: 'date',
        y: 'high',
      },
    },
    {
      id: 'low', // XXX codename tribeca
      name: 'Low',
      type: 'line',
      showSymbol: false,
      encode: {
        x: 'date',
        y: 'low',
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
