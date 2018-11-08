import React from 'react';
import {connect} from "dva/index";
import QueueAnim from  'rc-queue-anim'
import indexStyles from './index.less'


const getEffectOrReducerByName = name => `teampublish/${name}`

const TeamShow = (props) => {
  // console.log(props)
  const { dispatch, model, modal } = props
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
  const cardContentListProps = {
    modal,
    model,
    completeTask(data) {
      dispatch({
        type: getEffectOrReducerByName('completeTask'),
        payload: data
      })
    },
    getResponsibleTaskList(data) {
      dispatch({
        type: getEffectOrReducerByName('getResponsibleTaskList'),
        payload: data
      })
    },
    routingJump(path) {
      dispatch({
        type: getEffectOrReducerByName('routingJump'),
        payload: {
          route:path,
        },
      })
    }
  }
  let templateHtml = '<p></p><div class="media-wrap image-wrap float-left" style="float:left"><img id="xxx" title="xxx" alt="xxx" loop="" autoplay="" controls="" src="http://newdi-test.oss-cn-beijing.aliyuncs.com/2018-11-08/29e198f63f2b24f3617790f6c8d078bf.jpg?Expires=1541664091&amp;OSSAccessKeyId=LTAIiTOudd9oeHVo&amp;Signature=GrSDgTof3waXAo30GlJVzpci%2BU8%3D" width="200px" height="200px" style="width:200px;height:200px"/></div><p><em>handleEd萨达itorChange洒水多撒大声地阿萨</em></p>'
  console.log(templateHtml.length)
  return(
    <div>
      团队展示也
      <div className={indexStyles.pic}></div>
      <div  dangerouslySetInnerHTML={{__html: templateHtml}}></div>
    </div>
  )
};

//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({ modal, teamshow, loading }) {
  return { modal, model: teamshow, loading }
}
export default connect(mapStateToProps)(TeamShow)


