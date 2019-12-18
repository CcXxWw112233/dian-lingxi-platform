import React, { Component } from 'react'
import PlanningSchemeBreadcrumbNav from './PlanningSchemeBreadcrumbNav'
import PlanningSchemeItem from './PlanningSchemeItem'

export default class PlanningSchemeContainer extends Component {
  render() {
    return (
      <div>
        <div style={{marginBottom: '16px'}}><PlanningSchemeBreadcrumbNav {...this.props}/></div>
        <div><PlanningSchemeItem /></div>
      </div>
    )
  }
}
