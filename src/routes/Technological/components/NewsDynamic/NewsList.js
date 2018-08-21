import React from 'react';
import { Card, Icon, Input } from 'antd'
import NewsListStyle from './NewsList.less'
import QueueAnim from  'rc-queue-anim'
import { newsDynamicHandleTime } from '../../../../utils/util'
import Comment from './Comment'

export default class NewsList extends React.Component {

  allSetReaded() {

  }
  render() {
    //项目动态
    const news_1 =(
      <div className={NewsListStyle.news_1}>严世威 邀请你加入了「协作工作平台」项目。</div>
    )
    //项目动态编辑
    const news_2 = (<div className={NewsListStyle.news_2}>
      欢迎使用ProductName，为了帮助你更好的上手使用好ProductName，我们为你提前预置了这个项目并放置一些帮助你理解每项功能特性的任务卡片。
      不会耽误你特别多时间，只需要抽空点开卡片并跟随里面的内容提示进行简单操作，即可上手使用。
      此处显示的文字为项目的介绍信息，旨在帮助参与项目的成员快速了解项目的基本概况，点击可编辑。
      如果使用中需要问题，可以随时联系我们进行交流或反馈：support@ProductName.com
    </div>)
    //时间动态动态
    const news_3 = (
      <div  className={NewsListStyle.news_3}>
        <div className={NewsListStyle.news_3_text}>严世威 邀请你加入了「协作工作平台」项目。</div>
        <div className={NewsListStyle.news_3_time}>17:00</div>
      </div>
    )
    //评论动态
    const news_4 = (
      <div className={NewsListStyle.news_4}>
        <div  className={NewsListStyle.news_4_top}>
          <div className={NewsListStyle.news_4_left}>
            <img src="" />
          </div>
          <div className={NewsListStyle.news_4_right}>
            <div className={NewsListStyle.r_t}>
              <div className={NewsListStyle.r_t_l}>明显</div>
              <div className={NewsListStyle.r_t_r}>20:11</div>
            </div>
            <div className={NewsListStyle.r_b}>
              我刚刚是从动态里点击进来的，动态接受非常及时。我来演示一下发布带图片的评论样式吧~
              我刚刚是从动态里点击进来的，动态接受非常及时。我来演示一下发布带图片的评论样式吧~
              我刚刚是从动态里点击进来的，动态接受非常及时。我来演示一下发布带图片的评论样式吧~
            </div>
          </div>
        </div>
        <div  className={NewsListStyle.news_4_middle}>
          <img src="" />
          <img src="" />
        </div>
        <div  className={NewsListStyle.news_4_bottom}>
          <Comment />
        </div>
      </div>
    )
    //编辑动态
    const news_5 = (
      <div className={NewsListStyle.news_5}>
        <div className={NewsListStyle.news_5_title}>
          <div className={NewsListStyle.news_5_text}>严世威 邀请你加入了「协作工作平台」项目。</div>
          <div className={NewsListStyle.news_5_time}>17:00</div>
        </div>
        <div className={NewsListStyle.news_5_desctiption}>
          欢迎使用ProductName，为了帮助你更好的上手使用好ProductName，我们为你提前预置了这个项目并放置一些帮助你理解每项功能特性的任务卡片。 不会耽误你特别多时间，只需要抽空点开卡片并跟随里面的内容提示进行简单操作，即可上手使用。 此处显示的文字为项目的介绍信息，旨在帮助参与项目的成员快速了解项目的基本概况，点击可编辑。 如果使用中需要问题，可以随时联系我们进行交流或反馈：support@ProductName.com
        </div>
      </div>
    )

    const projectNews = (
      <div className={NewsListStyle.containr}>
        <div className={NewsListStyle.top}>
          <div className={NewsListStyle.left}>
            <div className={NewsListStyle.l_l}>
              <img src="" />
            </div>
            <div className={NewsListStyle.l_r}>
              <div>项目更新</div>
              <div>7月25日 19:48</div>
            </div>
          </div>
          <div className={NewsListStyle.right}>
            <Icon type="pushpin-o" className={NewsListStyle.timer}/><Icon type="check" className={NewsListStyle.check} />
          </div>
        </div>
        <div className={NewsListStyle.bott}>
          {news_1}
          {news_2}
        </div>
      </div>
    )
    const taskNews = ({ component }) =>{
      return (
        <div className={NewsListStyle.containr}>
          <div className={NewsListStyle.top}>
            <div className={NewsListStyle.left}>
              <div className={NewsListStyle.l_l}>
                <img src="" />
              </div>
              <div className={NewsListStyle.l_r}>
                <div>这是一条任务</div>
                <div>项目B <Icon type="caret-right"  style={{fontSize: 8}}/> 分组A</div>
              </div>
            </div>
            <div className={NewsListStyle.right}>
              <Icon type="pushpin-o" className={NewsListStyle.timer}/><Icon type="check" className={NewsListStyle.check} />
            </div>
          </div>
          <div className={NewsListStyle.bott}>
            {component}
          </div>
        </div>
      )
    }
    return (
      <div style={{paddingBottom:100}}>
        <div className={NewsListStyle.itemOut}>
          <div className={NewsListStyle.head}>
            <div>今天</div>
            <div onClick={this.allSetReaded.bind(this)}>全部标为已读</div>
          </div>
          {taskNews({component: news_4})}
          {projectNews}
        </div>
      </div>
    )
  }
}




