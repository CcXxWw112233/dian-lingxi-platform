import React from 'react';
import {connect} from "dva/index";
import Process from './Process'
import { Route, Router, Switch, Link } from 'dva/router'
import { Drawer } from 'antd'

const ProcessIndex = (props) => {
  console.log('🐶', props)
  return(
   <div>
     <Process {...props} />
   </div>
  )
}

export default ProcessIndex