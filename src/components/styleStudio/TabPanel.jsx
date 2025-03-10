import React from "react"

function TabPanel({ activeTab, onTabChange, tabs, children }) {
  // Find the active child based on the activeTab id
  const activeChild = React.Children.toArray(children).find((child) => child.props.id === activeTab)

  return (
    <div className="tabs">
      <div className="tabs-list">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? "tab-active" : ""}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content tab-content-active">{activeChild}</div>
    </div>
  )
}

export default TabPanel

