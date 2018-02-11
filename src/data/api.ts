/**
 * This file attempts to normalize the crazy json keys
 * of the (free-but-csv-biased) Alpha Vantage API
 * https://www.alphavantage.co/documentation/
 */

import * as qs from 'qs'

interface Request {
  apikey: string
  symbol: string
  function: TimeFunction
  interval?: Interval // only if Intraday
  outputsize: OutputSize
}

interface Response {
  timeseries: Datum[]
  metadata: Metadata
}

interface Datum {
  time: number // ms
  open: number
  high: number
  low: number
  close: number
  volume: number
  adjustedclose?: number // only if Adjusted
  dividendamount?: number // only if Adjusted
  splitcoefficient?: number // only if Adjusted Daily
}

interface Metadata {
  information: string
  symbol: string
  lastrefreshed: string
  timezone: string
}

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

const ENDPOINT = 'https://www.alphavantage.co/query?'
const API_KEY = 'EVUFAUSD0TZUIPVK'
const DEFAULT_REQUEST: Request = {
  apikey: API_KEY,
  symbol: 'SPX',
  function: TimeFunction.WeeklyAdjusted,
  interval: Interval.Min30,
  outputsize: 'compact',
}

export const getData = async (
  partialRequest: Partial<Request>,
): Promise<Response> => {
  const request = { ...DEFAULT_REQUEST, ...partialRequest }
  const params = qs.stringify(request)
  const response = await fetch(ENDPOINT + params)
  const result = await response.json()
  if (!result) throw new Error('Failed to fetch result')
  return normalize(result)
}

const normalize = (o: any): Response => {
  const timeseries = normalizeTimeseries(o)
  const metadata = normalizeMetadata(o)
  return { timeseries, metadata }
}

const normalizeTimeseries = (result: any): Datum[] => {
  const seriesKey = Object.keys(result).find(key => key.includes('Time Series'))
  if (!seriesKey) throw new Error('Failed to find Time Series')
  const rawSeries = result[seriesKey]
  return Object.keys(rawSeries).map(timestring => {
    const rawDatum = rawSeries[timestring]
    return Object.keys(rawDatum).reduce(
      (datum, key) => {
        if (key.endsWith('open')) {
          datum.open = Number(rawDatum[key])
        } else if (key.endsWith('high')) {
          datum.high = Number(rawDatum[key])
        } else if (key.endsWith('low')) {
          datum.low = Number(rawDatum[key])
        } else if (key.endsWith('close')) {
          datum.close = Number(rawDatum[key])
        } else if (key.endsWith('volume')) {
          datum.volume = Number(rawDatum[key])
        } else if (key.endsWith('adjusted close')) {
          datum.adjustedclose = Number(rawDatum[key])
        } else if (key.endsWith('dividend amount')) {
          datum.dividendamount = Number(rawDatum[key])
        } else if (key.endsWith('split coefficient')) {
          datum.splitcoefficient = Number(rawDatum[key])
        }
        return datum
      },
      { time: Math.floor(Date.parse(timestring) / 10000) } as Datum,
    )
  })
}

const normalizeMetadata = (result: any): Metadata => {
  const rawMeta = result['Meta Data']
  if (!rawMeta) throw new Error('Failed to find Meta Data')
  return Object.keys(rawMeta).reduce(
    (meta, key): Metadata => {
      if (key.endsWith('Information')) {
        meta.information = rawMeta[key]
      } else if (key.endsWith('Symbol')) {
        meta.symbol = rawMeta[key]
      } else if (key.endsWith('Last Refreshed')) {
        meta.lastrefreshed = rawMeta[key]
      } else if (key.endsWith('Time Zone')) {
        meta.timezone = rawMeta[key]
      }
      return meta
    },
    {} as Metadata,
  )
}
