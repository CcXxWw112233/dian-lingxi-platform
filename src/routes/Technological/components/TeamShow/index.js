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
  let templateHtml = '<div class="index__editTeamShow___2Z9PB"><div><div style="display: flex; margin-bottom: 40px; color: rgb(38, 38, 38);"><span class=""><div class="ant-upload ant-upload-select ant-upload-select-text"><span tabindex="0" class="ant-upload" role="button"><input type="file" accept="image/jpg, image/jpeg,  image/png" style="display: none;"><img src="http://newdi-test.oss-cn-beijing.aliyuncs.com/2018-11-07/29e198f63f2b24f3617790f6c8d078bf.jpg?Expires=1541589688&amp;OSSAccessKeyId=LTAIiTOudd9oeHVo&amp;Signature=UeWdFJCKD1w5SteJx8QQnnMDGSg%3D" style="width: 240px; height: 170px; background-color: rgb(255, 255, 255); border: 1px solid rgb(217, 217, 217); border-radius: 4px; cursor: pointer;"></span></div></span><div style="flex: 1 1 0%; margin-left: 20px;"><input placeholder="输入团队名称" type="text" class="ant-input" style="height: 40px; width: 100%; font-size: 16px;"><textarea placeholder="输入团队描述" class="ant-input" style="height: 120px; margin-top: 10px; width: 100%; resize: none; font-size: 12px;"></textarea></div></div><div style="width: 100%; background-color: rgb(255, 255, 255);"><div style="margin: 0px auto; background-color: rgb(255, 255, 255); width: 700px; text-align: center; height: auto; padding: 60px 0px;"><img src="http://newdi-test.oss-cn-beijing.aliyuncs.com/2018-11-07/29e198f63f2b24f3617790f6c8d078bf.jpg?Expires=1541589688&amp;OSSAccessKeyId=LTAIiTOudd9oeHVo&amp;Signature=UeWdFJCKD1w5SteJx8QQnnMDGSg%3D" style="width: 110px; height: 70px; border: 1px solid rgb(217, 217, 217); margin: 0px auto; border-radius: 4px;"><div style="margin-top: 16px; font-size: 24px;">按时大苏打飒飒的</div><div style="margin-top: 20px; font-size: 14px; text-align: left;">这些曹张新村自行车大数据卡拉就是打开链接ask来得及可拉斯基里看见撒旦刻录机埃里克森就打开了骄傲了啊速度加快卡拉手机打开链接阿喀琉斯大家刻录机阿斯达克垃圾啊两款手机的卢卡斯克拉大家来看</div></div></div></div></div>'
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


