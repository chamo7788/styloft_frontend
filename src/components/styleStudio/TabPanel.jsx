import React, { memo, useMemo } from "react"

const TabPanel = memo(({ activeTab, onTabChange, tabs, children }) => {
  // Find the active child based on the activeTab id - memoized to prevent recalculation
  const activeChild = useMemo(() => {
    return React.Children.toArray(children).find((child) => child.props.id === activeTab)
  }, [children, activeTab])

  return (
    <div className="tabs">
      <div className="tabs-list">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? "tab-active" : ""}`}
            onClick={() => onTabChange(tab.id)}
            aria-selected={activeTab === tab.id}
            role="tab"
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content tab-content-active" role="tabpanel">
        {activeChild}
      </div>
    </div>
  )
})

TabPanel.displayName = "TabPanel"

export default TabPanel

