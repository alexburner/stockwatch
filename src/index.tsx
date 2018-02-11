import 'babel-polyfill'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'

import { getData } from 'src/data/api'

const symbols = ['VTI', 'VXUS', 'VNQ', 'BND']

const width = 600
const height = 100
const top = 5
const left = 5
const right = 5
const bottom = 5

interface ChartDatum {
  time: number
  [key: string]: number
}

Promise.all(symbols.map(symbol => getData({ symbol }))).then(results => {
  const data = results.reduce(
    (memo, result) =>
      memo.concat(
        result.timeseries.map(datum => ({
          time: datum.time,
          [result.metadata.symbol]:
            datum.adjustedclose !== undefined
              ? datum.adjustedclose
              : datum.close,
        })),
      ),
    [] as ChartDatum[],
  )
  console.log(data)

  /**
   * Urf this is no bueno
   * time to find a charting lib
   * with first-class timeseries support
   */

  ReactDOM.render(
    <div>
      {symbols
        .map(symbol => (
          <LineChart
            key={symbol}
            data={data}
            syncId="id"
            width={width}
            height={height}
            margin={{ top, left, right, bottom }}
          >
            <XAxis type="number" dataKey="time" hide={true} />
            <YAxis type="number" dataKey={symbol} />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Line
              dataKey={symbol}
              type="monotone"
              stroke="#82ca9d"
              fill="#82ca9d"
            />
          </LineChart>
        ))
        .concat(
          <LineChart
            key="x-axis"
            syncId="id"
            width={width}
            height={40}
            margin={{ top, left, right, bottom }}
          >
            <XAxis type="number" dataKey="time" />
            <YAxis type="number" />
          </LineChart>,
        )}
    </div>,
    document.getElementById('root'),
  )
})
