import React from 'react';
import {connect} from "dva/index";
import Header from './Header'
import ProjectList from './ProjectList'
const getEffectOrReducerByName = name => `project/${name}`

const Project = (props) => {
  const { dispatch, model, modal } = props
  const prjectListProps = {
    modal,
    model,
    showModal() {
      dispatch({ type: 'modal/showModal' })
    },
    hideModal() {
      dispatch({ type: 'modal/hideModal' })
    }
  }
  const routingJump = (path) => {
    dispatch({
      type: getEffectOrReducerByName('routingJump'),
      payload: {
        route:path,
      },
    })
  }
  return(
    <div>
      <Header/>
      <ProjectList {...prjectListProps} routingJump={routingJump}/>
    </div>
  )
};

//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({ modal, project, loading }) {
  return { modal, model: project, loading }
}
export default connect(mapStateToProps)(Project)


