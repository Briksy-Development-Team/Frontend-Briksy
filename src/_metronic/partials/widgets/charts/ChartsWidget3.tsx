import React, { useEffect, useRef, useState } from 'react'
import ApexCharts, { ApexOptions } from 'apexcharts'
import { getCSSVariableValue } from '../../../assets/ts/_utils'
import { useThemeMode } from '../../layout/theme-mode/ThemeModeProvider'

type Props = {
  className: string
}

const ChartsWidget3: React.FC<Props> = ({ className }) => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const { mode } = useThemeMode()

  const [period, setPeriod] = useState<'year' | 'month' | 'week'>('year')

  const refreshMode = () => {
    if (!chartRef.current) {
      return
    }

    const chart = new ApexCharts(
      chartRef.current,
      getChartOptions(period)
    )

    chart.render()

    return chart
  }

  useEffect(() => {
    const chart = refreshMode()

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
            Recent Seekers
          </span>

          <span className='text-muted fw-semibold fs-7'>
            More than 1000 new seekers
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
          id='kt_charts_widget_3_chart'
          style={{ height: '350px' }}
        />
      </div>
    </div>
  )
}

export { ChartsWidget3 }

function getChartOptions(
  period: 'year' | 'month' | 'week'
): ApexOptions {
  const labelColor = getCSSVariableValue('--bs-gray-500')
  const borderColor = getCSSVariableValue('--bs-gray-200')
  const baseColor = getCSSVariableValue('--bs-info')
  const lightColor = getCSSVariableValue('--bs-info-light')

  let categories: string[] = []
  let seekerData: number[] = []

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

      seekerData = [
        44,
        55,
        57,
        56,
        61,
        58,
        66,
        33,
        20,
        77,
        89,
        95,
      ]
      break

    case 'month':
      categories = [
        'Week 1',
        'Week 2',
        'Week 3',
        'Week 4',
      ]

      seekerData = [150, 220, 180, 260]
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

      seekerData = [25, 35, 42, 28, 51, 39, 44]
      break
  }

  return {
    series: [
      {
        name: 'Seekers',
        data: seekerData,
      },
    ],

    chart: {
      fontFamily: 'inherit',
      type: 'area',
      height: 350,
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
      show: true,
      width: 3,
      colors: [baseColor],
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
          color: baseColor,
          width: 1,
          dashArray: 3,
        },
      },

      tooltip: {
        enabled: true,
        offsetY: 0,
        style: {
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

    colors: [lightColor],

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
      strokeColors: baseColor,
      strokeWidth: 3,
    },
  }
} 
