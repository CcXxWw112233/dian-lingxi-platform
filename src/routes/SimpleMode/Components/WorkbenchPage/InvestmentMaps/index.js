import React, { Component } from 'react';
import Cookies from 'js-cookie';
import { MAP_URL } from "@/globalset/js/constant";
import { connect } from 'dva';
import globalStyles from '@/globalset/css/globalClassName.less'
import indexStyles from './index.less';


@connect(({ InvestmentMaps = [],
    investmentMap: { datas: { mapOrganizationList } },
}) => ({
    InvestmentMaps, mapOrganizationList
}))
export default class index extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            height: document.querySelector('body').clientHeight,
            selectOrganizationVisible: false,
        }
    }
    componentDidMount() {
        window.addEventListener('resize', this.setHeight)

        const { dispatch } = this.props
        dispatch({
            type: 'investmentMap/getMapsQueryUser',
            payload: { }
        })
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.setHeight)
    }
    setHeight = () => {
        const height = document.querySelector('body').clientHeight
        this.setState({
            height
        })
    }

    seeInvestmentMaps(params) {
        this.setState({
            selectOrganizationVisible: true
        })
    }

    render() {
        const accessToken = Cookies.get('Authorization')
        const src_url = `${MAP_URL}?token=${accessToken}`
        const { user_set = {} } = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {};
        const { mapOrganizationList = [] } = this.props
        const { selectOrganizationVisible } = this.state
        const workbenchBoxContentElementInfo = document.getElementById('container_workbenchBoxContent');
        let contentHeight = workbenchBoxContentElementInfo ? workbenchBoxContentElementInfo.offsetHeight : 0;
        return (
            <div className={indexStyles.mapsContainer} style={{height:contentHeight+'px'}}>
                {user_set.current_org === '0' && selectOrganizationVisible === false ? (
                    <div className={indexStyles.boardSelectWapper}>
                        <div className={indexStyles.groupName}>请选择一个组织进行查看地图</div>
                        <div className={indexStyles.boardItemWapper}>
                            {
                                mapOrganizationList && mapOrganizationList.map((value, key) => {
                                    return (
                                        <div key={key} className={indexStyles.boardItem} onClick={e => this.seeInvestmentMaps(value)}>
                                            <i className={`${globalStyles.authTheme} ${indexStyles.boardIcon}`}>&#xe677;</i>
                                            <span className={indexStyles.boardName}>{value.name}</span>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                ) : (
                    <iframe src={src_url} scrolling='no' frameborder="0" width='100%' height={'100%'}></iframe>
                    )}
            </div>
        );
    }
}
