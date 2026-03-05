'use client'

import { Button } from './shared/Button'
import Heading, { HeadingWithSubProps } from './shared/Heading'
import { ArrowRight } from 'lucide-react'
import { FC, ReactNode, useState } from 'react'

interface Props extends Pick<HeadingWithSubProps, 'subHeading' | 'dimHeading'> {
  tabActive?: string
  tabs: string[]
  heading?: ReactNode
  onChangeTab?: (item: string) => void
  rightButtonHref?: string
}

const SectionTabHeader: FC<Props> = ({
  tabActive = 'Workplace',
  tabs,
  subHeading,
  dimHeading,
  heading,
  onChangeTab,
}) => {
  const [currentTab, setCurrentTab] = useState(tabActive)

  const handleClickTab = (tab: string) => {
    setCurrentTab(tab)
    onChangeTab && onChangeTab(tab)
  }

  return (
    <div className="section-tab-header relative mb-9 flex flex-col">
      {heading && (
        <Heading subHeading={subHeading} dimHeading={dimHeading}>
          {heading}
        </Heading>
      )}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex grow flex-wrap gap-2">
          {tabs.map((tab) =>
            currentTab === tab ? (
              <Button key={tab} color="dark/white" onClick={() => handleClickTab(tab)}>
                {tab}
              </Button>
            ) : (
              <Button key={tab} onClick={() => handleClickTab(tab)} outline>
                {tab}
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default SectionTabHeader
