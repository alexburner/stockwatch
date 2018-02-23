import format from 'date-fns/format'

const getDotHtml = (color: string): string => `
  <span style="
    display: inline-block;
    background-color: ${color};
    border-radius: 10px;
    margin: 0 2px;
    width: 10px;
    height: 10px;
  "></span>
`

const option: echarts.EChartOption = {
  backgroundColor: 'none',
  title: {
    top: '0',
    left: '50px',
    textStyle: {
      fontSize: 10,
      fontWeight: 'normal',
      color: 'rgba(255,255,255,0.6)',
    },
  },
  grid: {
    show: true,
    top: '10px',
    left: '50px',
    right: '70px',
    bottom: '10px',
    backgroundColor: 'rgba(255,255,255,0.01)',
    borderWidth: 0,
  },
  xAxis: {
    type: 'time',
    show: false,
  },
  yAxis: {
    type: 'value',
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
          return `${dot}${label} ${Number(value).toFixed(2)}`
        })
        .reverse()
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
      id: 'low', // XXX codename tribeca
      name: 'Low',
      type: 'line',
      showSymbol: false,
      color: 'rgba(241, 91, 91, 0.6)',
      encode: {
        x: 'date',
        y: 'low',
      },
    },
    {
      id: 'high', // XXX codename tribeca
      name: 'High',
      type: 'line',
      showSymbol: false,
      color: 'rgba(119, 242, 92, 0.6)',
      encode: {
        x: 'date',
        y: 'high',
      },
    },
  ],
}

export default option
