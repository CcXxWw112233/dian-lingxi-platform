import React, { Component } from 'react'
import PlanningSchemeBreadcrumbNav from './component/PlanningSchemeBreadcrumbNav'
import PlanningSchemeContent from './component/PlanningSchemeContent'

export default class PlanningSchemeContainer extends Component {
  render() {
    return (
      <div>
        <div style={{marginBottom: '16px'}}><PlanningSchemeBreadcrumbNav {...this.props}/></div>
        <div><PlanningSchemeContent {...this.props}/></div>
      </div>
    )
  }
}
