// 动态列表
import React, { Component } from 'react'
import DrawDetailInfoStyle from '../DrawDetailInfo.less'
import { connect } from 'dva'
import glabalStyles from '@/globalset/css/globalClassName.less'

@connect()
export default class DynamicContain extends Component {

  componentDidMount() {
    const { dispatch, board_id } = this.props
    this.props.dispatch({
      type: 'newsDynamic/getProjectDynamicsList',
      payload: {
        next_id: '0',
        board_id
      }
    })
  }

  render() {
    // console.log(this.props, 'sssss')
    return (
      <ul>
        <li>
          <div className={DrawDetailInfoStyle.left}>
            <img />
          </div>
          <div className={DrawDetailInfoStyle.right}>
            <div className={DrawDetailInfoStyle.news_text}>
              xxx 修改了原项目名 「xxx」为「xxx」名称。
            </div>
            <div className={DrawDetailInfoStyle.news_time}>xxxx时间</div>
          </div>
        </li>
        <li>
          <div className={DrawDetailInfoStyle.left}>
            <img />
          </div>
          <div className={DrawDetailInfoStyle.right}>
            <div className={DrawDetailInfoStyle.news_text}>
              xxx 修改了原项目名 「xxx」为「xxx」名称。
            </div>
            <div className={DrawDetailInfoStyle.news_time}>xxxx时间</div>
          </div>
        </li>
        <li>
          <div className={DrawDetailInfoStyle.left}>
            <img />
          </div>
          <div className={DrawDetailInfoStyle.right}>
            <div className={DrawDetailInfoStyle.news_text}>
              xxx 修改了原项目名 「xxx」为「xxx」名称。
            </div>
            <div className={DrawDetailInfoStyle.news_time}>xxxx时间</div>
          </div>
        </li>
        <li>
          <div className={DrawDetailInfoStyle.left}>
            <img />
          </div>
          <div className={DrawDetailInfoStyle.right}>
            <div className={DrawDetailInfoStyle.news_text}>
              xxx 修改了原项目名 「xxx」为「xxx」名称。
            </div>
            <div className={DrawDetailInfoStyle.news_time}>xxxx时间</div>
          </div>
        </li>
        <li>
          <div className={DrawDetailInfoStyle.left}>
            <img />
          </div>
          <div className={DrawDetailInfoStyle.right}>
            <div className={DrawDetailInfoStyle.news_text}>
              xxx 修改了原项目名 「xxx」为「xxx」名称。
            </div>
            <div className={DrawDetailInfoStyle.news_time}>xxxx时间</div>
          </div>
        </li>
        <li>
          <div className={DrawDetailInfoStyle.left}>
            <img />
          </div>
          <div className={DrawDetailInfoStyle.right}>
            <div className={DrawDetailInfoStyle.news_text}>
              xxx 修改了原项目名 「xxx」为「xxx」名称。
            </div>
            <div className={DrawDetailInfoStyle.news_time}>xxxx时间</div>
          </div>
        </li>
        <li>
          <div className={DrawDetailInfoStyle.left}>
            <img />
          </div>
          <div className={DrawDetailInfoStyle.right}>
            <div className={DrawDetailInfoStyle.news_text}>
              xxx 修改了原项目名 「xxx」为「xxx」名称。
            </div>
            <div className={DrawDetailInfoStyle.news_time}>xxxx时间</div>
          </div>
        </li>
        <li>
          <div className={DrawDetailInfoStyle.left}>
            <img />
          </div>
          <div className={DrawDetailInfoStyle.right}>
            <div className={DrawDetailInfoStyle.news_text}>
              xxx 修改了原项目名 「xxx」为「xxx」名称。
            </div>
            <div className={DrawDetailInfoStyle.news_time}>xxxx时间</div>
          </div>
        </li>
        <li>
          <div className={DrawDetailInfoStyle.left}>
            <img />
          </div>
          <div className={DrawDetailInfoStyle.right}>
            <div className={DrawDetailInfoStyle.news_text}>
              xxx 修改了原项目名 「xxx」为「xxx」名称。
            </div>
            <div className={DrawDetailInfoStyle.news_time}>xxxx时间</div>
          </div>
        </li><li>
          <div className={DrawDetailInfoStyle.left}>
            <img />
          </div>
          <div className={DrawDetailInfoStyle.right}>
            <div className={DrawDetailInfoStyle.news_text}>
              xxx 修改了原项目名 「xxx」为「xxx」名称。
            </div>
            <div className={DrawDetailInfoStyle.news_time}>xxxx时间</div>
          </div>
        </li><li>
          <div className={DrawDetailInfoStyle.left}>
            <img />
          </div>
          <div className={DrawDetailInfoStyle.right}>
            <div className={DrawDetailInfoStyle.news_text}>
              xxx 修改了原项目名 「xxx」为「xxx」名称。
            </div>
            <div className={DrawDetailInfoStyle.news_time}>xxxx时间</div>
          </div>
        </li><li>
          <div className={DrawDetailInfoStyle.left}>
            <img />
          </div>
          <div className={DrawDetailInfoStyle.right}>
            <div className={DrawDetailInfoStyle.news_text}>
              xxx 修改了原项目名 「xxx」为「xxx」名称。
            </div>
            <div className={DrawDetailInfoStyle.news_time}>xxxx时间</div>
          </div>
        </li><li>
          <div className={DrawDetailInfoStyle.left}>
            <img />
          </div>
          <div className={DrawDetailInfoStyle.right}>
            <div className={DrawDetailInfoStyle.news_text}>
              xxx 修改了原项目名 「xxx」为「xxx」名称。
            </div>
            <div className={DrawDetailInfoStyle.news_time}>xxxx时间</div>
          </div>
        </li><li>
          <div className={DrawDetailInfoStyle.left}>
            <img />
          </div>
          <div className={DrawDetailInfoStyle.right}>
            <div className={DrawDetailInfoStyle.news_text}>
              xxx 修改了原项目名 「xxx」为「xxx」名称。
            </div>
            <div className={DrawDetailInfoStyle.news_time}>xxxx时间</div>
          </div>
        </li><li>
          <div className={DrawDetailInfoStyle.left}>
            <img />
          </div>
          <div className={DrawDetailInfoStyle.right}>
            <div className={DrawDetailInfoStyle.news_text}>
              xxx 修改了原项目名 「xxx」为「xxx」名称。
            </div>
            <div className={DrawDetailInfoStyle.news_time}>xxxx时间</div>
          </div>
        </li><li>
          <div className={DrawDetailInfoStyle.left}>
            <img />
          </div>
          <div className={DrawDetailInfoStyle.right}>
            <div className={DrawDetailInfoStyle.news_text}>
              xxx 修改了原项目名 「xxx」为「xxx」名称。
            </div>
            <div className={DrawDetailInfoStyle.news_time}>xxxx时间</div>
          </div>
        </li><li>
          <div className={DrawDetailInfoStyle.left}>
            <img />
          </div>
          <div className={DrawDetailInfoStyle.right}>
            <div className={DrawDetailInfoStyle.news_text}>
              xxx 修改了原项目名 「xxx」为「xxx」名称。
            </div>
            <div className={DrawDetailInfoStyle.news_time}>xxxx时间</div>
          </div>
        </li><li>
          <div className={DrawDetailInfoStyle.left}>
            <img />
          </div>
          <div className={DrawDetailInfoStyle.right}>
            <div className={DrawDetailInfoStyle.news_text}>
              xxx 修改了原项目名 「xxx」为「xxx」名称。
            </div>
            <div className={DrawDetailInfoStyle.news_time}>xxxx时间</div>
          </div>
        </li>
        <li>
          <div className={DrawDetailInfoStyle.left}>
            <img />
          </div>
          <div className={DrawDetailInfoStyle.right}>
            <div className={DrawDetailInfoStyle.news_text}>
              xxx 修改了原项目名 「xxx」为「xxx」名称。
            </div>
            <div className={DrawDetailInfoStyle.news_time}>xxxx时间</div>
          </div>
        </li>
        <li>
          <div className={DrawDetailInfoStyle.left}>
            <img />
          </div>
          <div className={DrawDetailInfoStyle.right}>
            <div className={DrawDetailInfoStyle.news_text}>
              xxx 修改了原项目名 「xxx」为「xxx」名称。
            </div>
            <div className={DrawDetailInfoStyle.news_time}>xxxx时间</div>
          </div>
        </li>
        <li>
          <div className={DrawDetailInfoStyle.left}>
            <img />
          </div>
          <div className={DrawDetailInfoStyle.right}>
            <div className={DrawDetailInfoStyle.news_text}>
              xxx 修改了原项目名 「xxx」为「xxx」名称。
            </div>
            <div className={DrawDetailInfoStyle.news_time}>xxxx时间</div>
          </div>
        </li>
        <li>
          <div className={DrawDetailInfoStyle.left}>
            <img />
          </div>
          <div className={DrawDetailInfoStyle.right}>
            <div className={DrawDetailInfoStyle.news_text}>
              xxx 修改了原项目名 「xxx」为「xxx」名称。
            </div>
            <div className={DrawDetailInfoStyle.news_time}>xxxx时间</div>
          </div>
        </li>
      </ul>
    )
  }
}
