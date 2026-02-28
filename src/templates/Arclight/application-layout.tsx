import Footer from './components/Footer/Footer'
import Header2 from './components/Header/Header2'
import AsideSidebarNavigation from './components/aside-sidebar-navigation'
import React, { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

const ApplicationLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      {/* header - Chose header style here / header 1 or header 2*/}
      <Header2 />

      {children}

      {/* footer - Chose footer style here / footer 1 or footer 2 or footer 3 or footer 4 */}
      <Footer />
      {/* aside sidebar navigation */}
      <AsideSidebarNavigation />
    </>
  )
}

export { ApplicationLayout }
