import React, { Component } from 'react'
import { connect } from 'dva'
import CommonArticlesList from '../../common/CommonArticlesList'

@connect(({xczNews = []}) => ({
    xczNews, 
}))
export default class HighRise extends Component {
    render() {
        const { xczNews } = this.props;
        const { articlesList = [] } = xczNews;
        return (
            <div>
                <CommonArticlesList {...{articlesList}}/>
            </div>
        )
    }
}
