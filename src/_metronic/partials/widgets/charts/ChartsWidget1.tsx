import { useEffect, useRef, useState, FC } from 'react'
import ApexCharts, { ApexOptions } from 'apexcharts'
import { getCSS, getCSSVariableValue } from '../../../assets/ts/_utils'
import { useThemeMode } from '../../layout/theme-mode/ThemeModeProvider'

type Props = {
  className: string
}

const ChartsWidget1: FC<Props> = ({ className }) => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const { mode } = useThemeMode()

  const [period, setPeriod] = useState<'year' | 'month' | 'week'>('year')

  const refreshChart = () => {
    if (!chartRef.current) {
      return
    }

    const height = parseInt(getCSS(chartRef.current, 'height'))

    const chart = new ApexCharts(
      chartRef.current,
      getChartOptions(height, period)
    )

    chart.render()

    return chart
  }

  useEffect(() => {
    const chart = refreshChart()

    return () => {
      chart?.destroy()
    }
  }, [mode, period])

  return (
    <div className={`card ${className}`}>
      {/* Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>
            Recent Clients
          </span>

          <span className='text-muted fw-semibold fs-7'>
            More than 400 new members
          </span>
        </h3>

        <div className='card-toolbar'>
          <button
            type='button'
            onClick={() => setPeriod('year')}
            className={`btn btn-sm me-2 ${period === 'year'
                ? 'btn-light-primary'
                : 'btn-color-muted '
              }`}
          >
            Year
          </button>

          <button
            type='button'
            onClick={() => setPeriod('month')}
            className={`btn btn-sm me-2 ${period === 'month'
                ? 'btn-light-primary'
                : 'btn-color-muted '
              }`}
          >
            Month
          </button>

          <button
            type='button'
            onClick={() => setPeriod('week')}
            className={`btn btn-sm ${period === 'week'
                ? 'btn-light-primary'
                : 'btn-color-muted '
              }`}
          >
            Week
          </button>
        </div>
      </div>

      {/* Body */}
      <div className='card-body'>
        <div
          ref={chartRef}
          id='kt_charts_widget_1_chart'
          style={{ height: '350px' }}
        />
      </div>
    </div>
  )
}

export { ChartsWidget1 }

function getChartOptions(
  height: number,
  period: 'year' | 'month' | 'week'
): ApexOptions {
  const labelColor = getCSSVariableValue('--bs-gray-500')
  const borderColor = getCSSVariableValue('--bs-gray-200')

  const baseColor = getCSSVariableValue('--bs-primary')
  const secondaryColor = getCSSVariableValue('--bs-gray-300')

  let categories: string[] = []
  let soloTraderData: number[] = []
  let organizationData: number[] = []

  switch (period) {
    case 'year':
      categories = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ]

      soloTraderData = [
        44, 55, 57, 56, 61, 58,
        66, 33, 20, 77, 89, 50,
      ]

      organizationData = [
        76, 85, 101, 98, 87, 105,
        111, 123, 67, 11, 76, 90,
      ]
      break

    case 'month':
      categories = [
        'Week 1',
        'Week 2',
        'Week 3',
        'Week 4',
      ]

      soloTraderData = [120, 95, 140, 170]

      organizationData = [180, 150, 210, 240]
      break

    case 'week':
      categories = [
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat',
        'Sun',
      ]

      soloTraderData = [12, 18, 22, 15, 28, 20, 17]

      organizationData = [22, 35, 30, 25, 40, 28, 24]
      break
  }

  return {
    series: [
      {
        name: 'Solo Traders',
        data: soloTraderData,
      },
      {
        name: 'Organization',
        data: organizationData,
      },
    ],

    chart: {
      fontFamily: 'inherit',
      type: 'bar',
      height,
      toolbar: {
        show: false,
      },
    },

    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '30%',
        borderRadius: 5,
      },
    },

    legend: {
      show: false,
    },

    dataLabels: {
      enabled: false,
    },

    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },

    xaxis: {
      categories,

      axisBorder: {
        show: false,
      },

      axisTicks: {
        show: false,
      },

      labels: {
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },

    yaxis: {
      labels: {
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },

    fill: {
      opacity: 1,
    },

    states: {
      hover: {
        filter: {
          type: 'none',
        },
      },

      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: 'none',
        },
      },
    },

    tooltip: {
      style: {
        fontSize: '12px',
      },

      y: {
        formatter: function (val) {
          return `${val}`
        },
      },
    },

    colors: [baseColor, secondaryColor],

    grid: {
      borderColor,
      strokeDashArray: 4,

      yaxis: {
        lines: {
          show: true,
        },
      },
    },
  }
}
