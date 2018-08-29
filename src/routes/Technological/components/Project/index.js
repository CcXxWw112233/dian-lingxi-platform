import React from 'react';
import {connect} from "dva/index";
import Header from './Header'
import ProjectList from './ProjectList'
import QueueAnim from  'rc-queue-anim'

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
    },
    addNewProject(data) {
      dispatch({
        type: getEffectOrReducerByName('addNewProject'),
        payload: data
      })
    },
    collectionProject(id) {
      dispatch({
        type: getEffectOrReducerByName('collectionProject'),
        payload: {
          id
        }
      })
    },
    cancelCollection(id) {
      dispatch({
        type: getEffectOrReducerByName('cancelCollection'),
        payload: {
          id
        }
      })
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
      <QueueAnim  type="top">
        <ProjectList {...prjectListProps} routingJump={routingJump} key={'1'}/>
      </QueueAnim>
    </div>
  )
};

//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({ modal, project, loading }) {
  return { modal, model: project, loading }
}
export default connect(mapStateToProps)(Project)


