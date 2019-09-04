import React, { Component } from 'react'
import { Switch, Redirect, Route } from 'dva/router'
import { connect } from 'dva'
import Header from './components/header/Header'
import Hot from './components/hot/Hot'
import HighRise from './components/highRise/HighRise'
import Authority from './components/authority/Authority'
import Area from './components/area/Area'
import DataBase from './components/database/DataBase'
import globalStyles from '@/globalset/css/globalClassName.less'
import indexStyles from './index.less';

@connect(({ xczNews: { XczNewsOrganizationList }, }) => ({
    XczNewsOrganizationList,
}))
export default class index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectOrganizationVisible: false,
        }
    }
    componentDidMount() {
        const { dispatch } = this.props
        dispatch({
            type: 'xczNews/getXczNewsQueryUser',
            payload: {}
        })
    }
    seeXczNews(params) {
        this.setState({
            selectOrganizationVisible: true
        })
    }
    render() {
        const { user_set = {} } = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {};
        const { XczNewsOrganizationList = [] } = this.props
        const { selectOrganizationVisible } = this.state

        const { location } = this.props;
        return (
            <div>
                {user_set.current_org === '0' && selectOrganizationVisible === false ? (
                    <div className={indexStyles.boardSelectWapper}>
                        <div className={indexStyles.groupName}>请选择一个组织进行查看政策法规</div>
                        <div className={indexStyles.boardItemWapper}>
                            {
                                XczNewsOrganizationList && XczNewsOrganizationList.map((value, key) => {
                                    return (
                                        <div key={key} className={indexStyles.boardItem} onClick={e => this.seeXczNews(value)}>
                                            <i className={`${globalStyles.authTheme} ${indexStyles.boardIcon}`}>&#xe69c;</i>
                                            <span className={indexStyles.boardName}>{value.name}</span>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                ) : (
                        <div>
                            <Header location={location} />
                            <Switch>
                                {/* <Route path="/technological/xczNews" exact component={ SearchArticlesList } /> */}
                                <Route path="/technological/simplemode/workbench/xczNews/hot" component={Hot} />
                                <Route path="/technological/simplemode/workbench/xczNews/highRise" component={HighRise} />
                                <Route path="/technological/simplemode/workbench/xczNews/authority" component={Authority} />
                                <Route path="/technological/simplemode/workbench/xczNews/area" component={Area} />
                                <Route path="/technological/simplemode/workbench/xczNews/database" component={DataBase} />

                                {/* 重定向 */}
                                <Redirect from="/technological/simplemode/workbench/xczNews" to="/technological/simplemode/workbench/xczNews/hot" />
                            </Switch>
                        </div>
                    )}
            </div>
        )
    }
}
