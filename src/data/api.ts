import * as qs from 'qs'

/**
 * This attempts to normalize the crazy keys of
 * the (wonderfully free) Alpha Vantage API:
 * https://www.alphavantage.co/documentation/
 */

export enum TimeFunction {
  Intraday = 'TIME_SERIES_INTRADAY',
  Daily = 'TIME_SERIES_DAILY',
  Weekly = 'TIME_SERIES_WEEKLY',
  Monthly = 'TIME_SERIES_MONTHLY',
  DailyAdjusted = 'TIME_SERIES_DAILY_ADJUSTED',
  WeeklyAdjusted = 'TIME_SERIES_WEEKLY_ADJUSTED',
  MonthlyAdjusted = 'TIME_SERIES_MONTHLY_ADJUSTED',
}

export enum Interval {
  Min1 = '1min',
  Min5 = '5min',
  Min15 = '15min',
  Min30 = '30min',
  Min60 = '60min',
}

type OutputSize = 'compact' | 'full'

interface Request {
  apikey: string
  symbol: string
  function: TimeFunction
  interval?: Interval // only if Intraday
  outputsize: OutputSize
}

interface Metadata {
  information: string
  symbol: string
  lastrefreshed: string
  timezone: string
}

interface Datum {
  timestamp: string
  open: number
  high: number
  low: number
  close: number
  volume: number
  adjustedclose?: number // only if Adjusted
  dividendamount?: number // only if Adjusted
  splitcoefficient?: number // only if Adjusted Daily
}

interface Response {
  metadata: Metadata
  timeseries: Datum[]
}

const ENDPOINT = 'https://www.alphavantage.co/query?'
const API_KEY = 'EVUFAUSD0TZUIPVK'

const defaultRequest = {
  apikey: API_KEY,
  symbol: 'SPX',
  function: TimeFunction.Intraday,
  interval: Interval.Min1,
  outputsize: 'full',
}

export const getData = async (
  partialRequest: Partial<Request>,
): Promise<Response> => {
  const request = { ...defaultRequest, ...partialRequest }
  const params = qs.stringify(request)
  const response = await fetch(ENDPOINT + params)
  const result = await response.json()
  return normalize(result)
}

const normalize = (o: any): Response => {
  const metadata = normalizeMetadata(o)
  const timeseries = normalizeTimeseries(o)
  return { metadata, timeseries }
}

const normalizeMetadata = (o: any): Metadata => {
  const mdKey = 'Meta Data'
  const md = o[mdKey]
  return Object.keys(md).reduce(
    (x, key): Metadata => {
      if (key.includes('Information')) {
        x.information = md[key]
      } else if (key.includes('Symbol')) {
        x.symbol = md[key]
      } else if (key.includes('Last Refreshed')) {
        x.lastrefreshed = md[key]
      } else if (key.includes('Time Zone')) {
        x.timezone = md[key]
      }
      return x
    },
    {} as Metadata,
  )
}

const normalizeTimeseries = (o: any): Datum[] => {
  const tsKey = Object.keys(o).filter(key => key.includes('Time Series'))[0]
  const ts = o[tsKey]
  return Object.keys(ts).map(timestamp => {
    const d = ts[timestamp]
    return Object.keys(d).reduce(
      (x, key) => {
        if (key.includes('open')) {
          x.open = Number(d[key])
        } else if (key.includes('high')) {
          x.high = Number(d[key])
        } else if (key.includes('low')) {
          x.low = Number(d[key])
        } else if (key.includes('close')) {
          x.close = Number(d[key])
        } else if (key.includes('volume')) {
          x.volume = Number(d[key])
        } else if (key.includes('adjusted close')) {
          x.adjustedclose = Number(d[key])
        } else if (key.includes('dividend amount')) {
          x.dividendamount = Number(d[key])
        } else if (key.includes('split coefficient')) {
          x.splitcoefficient = Number(d[key])
        }
        return x
      },
      { timestamp } as Datum,
    )
  })
}
