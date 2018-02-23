import 'babel-polyfill'
import ReactEcharts from 'echarts-for-react'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { ChartDatum, getCharts, getSymbols, TimeRange } from 'src/data/api'
import option from 'src/option'

const SYM = ['VTI', 'VXUS', 'VNQ', 'BND']

interface Dataset {
  min: number
  max: number
  range: number
  padding: number
}

interface Chart extends Dataset {
  symbol: string
  data: ChartDatum[]
}

interface ChartGroup extends Dataset {
  charts: Chart[]
}

const structureResults = (
  results: ChartDatum[][],
  symbols: string[],
): ChartGroup => {
  const PAD = 1 / 6
  const chartGroup: ChartGroup = {
    charts: [],
    min: Infinity,
    max: -Infinity,
    range: 0,
    padding: 0,
  }
  results.forEach((result, i) => {
    const chart: Chart = {
      symbol: symbols[i],
      data: result,
      min: Infinity,
      max: -Infinity,
      range: 0,
      padding: 0,
    }
    result.forEach(datum => {
      chart.max = Math.max(chart.max, datum.high)
      chart.min = Math.min(chart.min, datum.low)
    })
    chart.range = chart.max - chart.min
    chart.padding = chart.range * PAD
    chartGroup.charts.push(chart)
    chartGroup.max = Math.max(chartGroup.max, chart.max)
    chartGroup.min = Math.min(chartGroup.min, chart.min)
  })
  chartGroup.range = chartGroup.max - chartGroup.min
  chartGroup.padding = chartGroup.range * PAD
  return chartGroup
}

getCharts(SYM, TimeRange.Y1).then(results => {
  const chartGroup = structureResults(results, SYM)
  ReactDOM.render(
    <div>
      {chartGroup.charts.map((chart, i) => (
        <ReactEcharts
          key={chart.symbol}
          option={{
            ...option,
            yAxis: {
              ...option.yAxis,
              max: chart.max + chart.padding,
              min: chart.min - chart.padding,
            },
            title: {
              ...option.title,
              text: chart.symbol,
            },
            dataset: {
              source: chart.data,
            },
          }}
          style={{ height: '175px', width: '100%' }}
          theme="dark"
        />
      ))}
    </div>,
    document.getElementById('root'),
  )
})

// getSymbols().then((results: any) => {
//   console.log(results)
// })
