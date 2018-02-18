export interface SymbolDatum {
  date: string
  iexId: string
  isEnabled: boolean
  name: string
  symbol: string
  type: string
}

export interface ChartDatum {
  change: number
  changePercent: number
  close: number
  date: string
  high: number
  low: number
  open: number
  volume: number
  vwap: number
}

export enum TimeRange {
  M1 = '1m',
  M3 = '3m',
  M6 = '6m',
  Y1 = '1y',
  Y2 = '2y',
  Y5 = '5y',
}

const ENDPOINT = 'https://api.iextrading.com/1.0'

export const getSymbols = async (): Promise<SymbolDatum[]> => {
  const path = '/ref-data/symbols'
  const response = await fetch(ENDPOINT + path)
  const results = (await response.json()) as SymbolDatum[]
  if (!results || !results.length) throw new Error('Failed to fetch symbols')
  return results
}

export const getCharts = async (
  symbols: string[],
  range: TimeRange = TimeRange.M1,
): Promise<ChartDatum[][]> => {
  const path = `/stock/market/chart/${range}?symbols=${symbols.join(',')}`
  const response = await fetch(ENDPOINT + path)
  const results = (await response.json()) as ChartDatum[][]
  if (!results || !results.length) throw new Error('Failed to fetch charts')
  return results
}
