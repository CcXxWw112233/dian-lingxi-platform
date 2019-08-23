import React, { Component } from 'react';
import Cookies from 'js-cookie';
import { MAP_URL } from "@/globalset/js/constant";
import { connect } from 'dva';
import globalStyles from '@/globalset/css/globalClassName.less'
import indexStyles from './index.less';


@connect(({ InvestmentMaps = [], 
    technological: { datas: { currentUserOrganizes = [] } }, 
    organizationManager: { datas: { InvestmentMapsSelectOrganizationVisible }}, }) => ({
    InvestmentMaps, currentUserOrganizes, InvestmentMapsSelectOrganizationVisible,
}))
export default class index extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            height: document.querySelector('body').clientHeight,
            selectOrganizationVisible: true,
        }
    }
    componentDidMount() {
        window.addEventListener('resize', this.setHeight)
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
        const { dispatch } = this.props
        dispatch({
            type: 'organizationManager/getFnManagementList',
            payload: {
                organization_id: params.id,
            }
        })
    }
    componentWillUnmount() {
        const { dispatch } = this.props
        dispatch({
            type: 'organizationManager/updateDatas',
            payload: {
                InvestmentMapsSelectOrganizationVisible: false
            }
        })
    }
    render() {
        const { currentUserOrganizes = [], InvestmentMapsSelectOrganizationVisible, organizationManager } = this.props
        const accessToken = Cookies.get('Authorization')
        const src_url = `${MAP_URL}?token=${accessToken}`
        const { height } = this.state
        const { user_set = {} } = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {};
        
        return (
            <div>
                {user_set.current_org === '0' && InvestmentMapsSelectOrganizationVisible !== true  ? (
                    <div className={indexStyles.boardSelectWapper}>
                        <div className={indexStyles.groupName}>请选择一个组织进行查看地图</div>
                        <div className={indexStyles.boardItemWapper}>
                            {
                                currentUserOrganizes && currentUserOrganizes.map((value, key) => {
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
                        <div>
                            <iframe src={src_url} scrolling='no' frameborder="0" width='100%' height={height}></iframe>
                        </div>
                    )}
            </div>
        );
    }
}