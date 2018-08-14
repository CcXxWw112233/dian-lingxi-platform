import React from 'react';
import {connect} from "dva/index";
import Header from './Header'
import ProjectList from './ProjectList'

const Project = (options) => {
  return(
    <div>
      <Header/>
      <ProjectList />
    </div>
  )
};

export default connect(({ accountSet }) => {
  return {
    accountSet,
  }
})(Project);
