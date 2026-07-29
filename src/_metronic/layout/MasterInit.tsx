import {useEffect} from 'react'
import {Tab} from 'bootstrap'
import {
  MenuComponent,
  DrawerComponent,
  ScrollComponent,
  ScrollTopComponent,
  StickyComponent,
  ToggleComponent,
  SwapperComponent,
} from '../assets/ts/components'
import {ThemeModeComponent} from '../assets/ts/layout'

import {useLayout} from './core'

export function MasterInit() {
  const {config} = useLayout()

  const pluginsInitialization = () => {
    ThemeModeComponent.init()
    setTimeout(() => {
      ToggleComponent.bootstrap()
      ScrollTopComponent.bootstrap()
      DrawerComponent.bootstrap()
      StickyComponent.bootstrap()
      MenuComponent.bootstrap()
      ScrollComponent.bootstrap()
      SwapperComponent.bootstrap()
      document.querySelectorAll('[data-bs-toggle="tab"]').forEach((tab) => {
        Tab.getOrCreateInstance(tab)
      })
    }, 500)
  }

  useEffect(() => {
    pluginsInitialization()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config])

  return <></>
}
