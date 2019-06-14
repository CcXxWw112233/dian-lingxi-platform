// 热点页面

import React, { Component } from 'react'
import mainStyles from './hot.less'
import { connect } from 'dva'
import HotArticlesList from './HotArticlesList'

@connect(({xczNews = []}) => ({
    xczNews, 
}))
export default class Hot extends Component {

    state = {
        selected_tab_id: 0, //热点Tabs的选项切换高亮效果
    }

    // 热点点击的显示对应的内容
    handleHotContent = ({ id }) => {
        this.setState({
            selected_tab_id: id
        })
        const { dispatch } = this.props
        dispatch({
          type: 'xczNews/getHotArticles',
          payload: {
            hotspot_id: id,
            default_page_size: 5,
          }
        })
    }

    render() {
        // console.log(this.props)
        const { xczNews } = this.props;
        // console.log(xczNews)
        const { hotTabs = [], hotArticlesList = [] } = xczNews;
        const { selected_tab_id } = this.state
        // console.log(hotArticlesList);
        return (
            <div className={mainStyles.mainContainer}>
                <div className={mainStyles.list}>
                    {
                       hotTabs.map((item, index) => {
                           return (
                                <div 
                                    className={`${mainStyles.hotTabs} ${item.id == selected_tab_id || selected_tab_id == index  ? mainStyles.current : ''}`}
                                    id={item.id}
                                    onClick={() => this.handleHotContent({id: item.id})}
                                >{ item.name }</div>
                           )
                       }) 
                    }
                </div>
                <HotArticlesList {...{hotArticlesList}} />
            </div>
        )
    }
}
