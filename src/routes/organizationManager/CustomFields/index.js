import React, { Component } from 'react'
import { connect } from 'dva'
import ContainerWithIndexUI from './ContainerWithIndexUI'

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addCustomFieldsList: () => {
    }
  }
}


export default connect(mapStateToProps,mapDispatchToProps)(ContainerWithIndexUI)