import {FC} from 'react'
import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {useLocation} from 'react-router'
import {checkIsActive, KTIcon, KTSVG, WithChildren} from '../../../../helpers'
import {useLayout} from '../../../core'

type Props = {
  to: string
  title: string
  icon?: string
  fontIcon?: string
  hasBullet?: boolean
  exact?: boolean
  excludePaths?: string[]
  activeSearchParams?: Record<string, string>
  excludeSearchParams?: Record<string, string>
}

const SidebarMenuItem: FC<Props & WithChildren> = ({
  children,
  to,
  title,
  icon,
  fontIcon,
  hasBullet = false,
  exact = false,
  excludePaths = [],
  activeSearchParams,
  excludeSearchParams,
}) => {
  const {pathname, search} = useLocation()
  const query = new URLSearchParams(search)
  const matchesSearchParams = (expected?: Record<string, string>) =>
    !expected || Object.entries(expected).every(([key, value]) => query.get(key) === value)
  const isExcludedBySearch = Boolean(
    excludeSearchParams && matchesSearchParams(excludeSearchParams),
  )
  const isActive = checkIsActive(pathname, to.split(/[?#]/)[0], exact, excludePaths)
    && matchesSearchParams(activeSearchParams)
    && !isExcludedBySearch
  const {config} = useLayout()
  const {app} = config

  return (
    <div className='menu-item'>
      <Link className={clsx('menu-link without-sub', {active: isActive})} to={to}>
        {hasBullet && (
          <span className='menu-bullet'>
            <span className='bullet bullet-dot'></span>
          </span>
        )}
        {icon && app?.sidebar?.default?.menu?.iconType === 'svg' && (
          <span className='menu-icon'>
            {icon.startsWith('/') || icon.endsWith('.svg') ? (
              <KTSVG path={icon} className='svg-icon-2' svgClassName='w-20px h-20px' />
            ) : (
              <KTIcon iconName={icon} className='fs-2' />
            )}
          </span>
        )}
        {fontIcon && app?.sidebar?.default?.menu?.iconType === 'font' && (
          <i className={clsx('bi fs-3', fontIcon)}></i>
        )}
        <span className='menu-title'>{title}</span>
      </Link>
      {children}
    </div>
  )
}

export {SidebarMenuItem}
