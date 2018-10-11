import React from 'react';
import {connect} from "dva/index";
import QueueAnim from  'rc-queue-anim'
import indexStyles from './index.less'
import CardContent from './CardContent'
import Header from './Header'

const getEffectOrReducerByName = name => `workbench/${name}`

const Workbench = (props) => {
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
      dispatch({ type: 'modal/hideModal' })
    },
  }
  const routingJump = (path) => {
    dispatch({
      type: getEffectOrReducerByName('routingJump'),
      payload: {
        route:path,
      },
    })
  }
  const updateDatas = (payload) => {
    dispatch({
      type: getEffectOrReducerByName('updateDatas') ,
      payload:payload
    })
  }
  return(
    <div>
      <Header />
       <div className={indexStyles.workbenchOut}>
      <div className={indexStyles.cardItem}>
        <div className={indexStyles.cardItem_left}>
          <CardContent title={'我负责的任务'} />
        </div>
        <div className={indexStyles.cardItem_right}>
          <CardContent title={'我关注的任务'} />
        </div>
      </div>
      <div className={indexStyles.cardItem}>
        <div className={indexStyles.cardItem_left}>
          <CardContent title={'待我处理的流程'} />
        </div>
        <div className={indexStyles.cardItem_right}>
          <CardContent title={'我参与的流程'} />
        </div>
      </div>
      <div className={indexStyles.cardItem}>
        <div className={indexStyles.cardItem_left}>
          <CardContent title={'我收藏的文档'} />
        </div>
        <div className={indexStyles.cardItem_right}>
          <CardContent title={'我上传的文档'} />
        </div>
      </div>
    </div>
    </div>
  )
};

//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({ modal, workbench, loading }) {
  return { modal, model: workbench, loading }
}
export default connect(mapStateToProps)(Workbench)


