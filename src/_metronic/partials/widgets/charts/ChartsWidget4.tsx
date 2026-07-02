import { useEffect, useRef, useState, FC } from 'react'
import ApexCharts, { ApexOptions } from 'apexcharts'
import { getCSS, getCSSVariableValue } from '../../../assets/ts/_utils'
import { useThemeMode } from '../../layout/theme-mode/ThemeModeProvider'

type Props = {
  className: string
}

const ChartsWidget4: FC<Props> = ({ className }) => {
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
      if (chart) {
        chart.destroy()
      }
    }
  }, [mode, period])

  return (
    <div className={`card ${className}`}>
      {/* Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>
            Clients
          </span>

          <span className='text-muted fw-semibold fs-7'>
            More than 500 new customers
          </span>
        </h3>

        {/* Toolbar */}
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
          id='kt_charts_widget_4_chart'
          style={{ height: '350px' }}
        />
      </div>
    </div>
  )
}

export { ChartsWidget4 }

function getChartOptions(
  height: number,
  period: 'year' | 'month' | 'week'
): ApexOptions {
  const labelColor = getCSSVariableValue('--bs-gray-500')
  const borderColor = getCSSVariableValue('--bs-gray-200')

  const baseColor = '#f5551a'        // --accent orange
  const baseLightColor = 'rgba(245,85,26,0.12)'

  const secondaryColor = '#342511'   // --dark-brown
  const secondaryLightColor = 'rgba(52,37,17,0.10)'

  let categories: string[] = []
  let profitData: number[] = []
  let revenueData: number[] = []

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

      profitData = [76, 85, 101, 98, 87, 105, 111, 123, 67, 11, 76, 90]

      revenueData = [44, 55, 57, 56, 61, 58, 66, 33, 20, 77, 89, 50]
      break

    case 'month':
      categories = ['Week 1', 'Week 2', 'Week 3', 'Week 4']

      profitData = [120, 180, 150, 210]

      revenueData = [90, 140, 130, 160]
      break

    case 'week':
      categories = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

      profitData = [22, 35, 18, 40, 45, 28, 32]

      revenueData = [15, 20, 16, 25, 30, 22, 18]
      break
  }

  return {
    series: [
      {
        name: 'Organization',
        data: profitData,
      },
      {
        name: 'Solo Traders',
        data: revenueData,
      },
    ],

    chart: {
      fontFamily: 'inherit',
      type: 'area',
      height,
      toolbar: {
        show: false,
      },
    },

    legend: {
      show: false,
    },

    dataLabels: {
      enabled: false,
    },

    fill: {
      type: 'solid',
      opacity: 1,
    },

    stroke: {
      curve: 'smooth',
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

      crosshairs: {
        position: 'front',
        stroke: {
          color: labelColor,
          width: 1,
          dashArray: 3,
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

    tooltip: {
      style: {
        fontSize: '12px',
      },

      y: {
        formatter: (val) => `$${val} thousands`,
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

    markers: {
      colors: [baseLightColor, secondaryLightColor],
      strokeColors: [baseLightColor, secondaryLightColor],
      strokeWidth: 3,
    },
  }
}