import React, { Component } from 'react'
import { connect } from 'dva'
import ContainerWithIndexUI from './ContainerWithIndexUI'

const mapStateToProps = (state) => {
  const { organizationManager: { datas: { customFieldsList = {} } } } = state
  return {
    customFieldsList
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    addCustomFieldsList: () => {
    }
  }
}


export default connect(mapStateToProps,mapDispatchToProps)(ContainerWithIndexUI)
