import React from 'react'
// import MenuSearchStyles from './MenuSearch.less'
import { Input, Menu, Spin, Icon, message } from 'antd'
import indexStyles from './index.less'
import ShowAddMenberModal from '../../routes/Technological/components/Project/ShowAddMenberModal'
import { checkIsHasPermissionInBoard, } from "../../utils/businessFunction";
import { MESSAGE_DURATION_TIME, NOT_HAS_PERMISION_COMFIRN, PROJECT_TEAM_BOARD_MEMBER } from "@/globalset/js/constant";
import { isApiResponseOk } from '../../utils/handleResponseData';
import { organizationInviteWebJoin, commInviteWebJoin, } from '../../services/technological/index'
import { connect } from 'dva';
import globalStyles from '@/globalset/css/globalClassName.less'
/**加入里程碑组件 */
@connect(({ }) => ({

}))
export default class MilestoneAdd extends React.Component {
    state = {
        resultArr: [],
        keyWord: '',
        selectedKeys: []
    }
    componentWillMount() {

    }
    componentDidMount() {
        const { dispatch } = this.props;
        // dispatch({

        // });
    }

    componentWillReceiveProps(nextProps) {

    }
    //模糊查询
    handleMenuReallySelect = (e) => {
        this.setSelectKey(e, 'add')
    }
    handleMenuReallyDeselect(e) {
        this.setSelectKey(e, 'remove')
    }
    setSelectKey(e, type) {
        const { key, selectedKeys } = e
        if (!key) {
            return false
        }
        this.setState({
            selectedKeys
        }, () => {
            const { listData = [], searchName } = this.props
            const { keyWord } = this.state
            this.setState({
                resultArr: this.fuzzyQuery(listData, searchName, keyWord),
            })
        })
        this.props.chirldrenTaskChargeChange && this.props.chirldrenTaskChargeChange({ selectedKeys, key, type })
    }
    onCheck() {
        if (this.props.onCheck && typeof this.props.onCheck === 'function') {
            this.props.onCheck(this.state.selectedKeys)
        }
    }
    fuzzyQuery = (list, searchName, keyWord) => {
        var arr = [];
        for (var i = 0; i < list.length; i++) {
            if (list[i][searchName].indexOf(keyWord) !== -1) {
                arr.push(list[i]);
            }
        }

        //添加里程碑后往后放
        const { selectedKeys } = this.state
        for (let i = 0; i < arr.length; i++) {
            if (selectedKeys.indexOf(arr[i]['user_id']) != -1) {
                if (i > 0 && selectedKeys.indexOf(arr[i - 1]['user_id']) == -1) {
                    const deItem = arr.splice(i, 1)
                    arr.unshift(...deItem)
                }
            }
        }
        return arr;
    }
    onChange = (e) => {
        const { listData = [], searchName } = this.props
        const keyWord = e.target.value
        const resultArr = this.fuzzyQuery(listData, searchName, keyWord)
        this.setState({
            keyWord,
            resultArr
        })
    }



    render() {
        const { keyWord, resultArr, selectedKeys = [] } = this.state
        const { Inputlaceholder = '搜索', searchName, menuSearchSingleSpinning, keyCode, rela_Condition, is_selected_all } = this.props

        return (
            <div>
                <Menu style={{ padding: '8px 0px', boxShadow: '0px 2px 8px 0px rgba(0,0,0,0.15)', maxWidth: 200, }}
                    selectedKeys={selectedKeys}
                    onDeselect={this.handleMenuReallyDeselect.bind(this)}
                    onSelect={this.handleMenuReallySelect} multiple >

                    <div style={{ margin: '0 10px 10px 10px' }}>
                        <Input placeholder={Inputlaceholder} value={keyWord} onChange={this.onChange.bind(this)} />
                    </div>
                    <Menu className={globalStyles.global_vertical_scrollbar} style={{ maxHeight: '248px', overflowY: 'auto' }}>
                        <div style={{ padding: 0, margin: 0, height: 32, lineHeight: '32px', cursor: 'pointer' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }} >
                                <div style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: '&#xe70b;', marginRight: 4, color: 'rgb(73, 155, 230)', }}>
                                    <Icon type={'plus-circle'} style={{ fontSize: 12, marginLeft: 10, color: 'rgb(73, 155, 230)' }} />
                                </div>
                                <span style={{ color: 'rgb(73, 155, 230)' }}>新建里程碑</span>
                            </div>
                        </div>
                        {
                            resultArr.map((value, key) => {
                                const { avatar, name, user_name, user_id } = value
                                return (
                                    <Menu.Item className={`${indexStyles.menuItem}`} style={{ height: '40px', lineHeight: '40px', margin: 0, padding: '0 12px' }} key={value[keyCode]} >

                                        <div className={indexStyles.menuItemDiv}>
                                            <div style={{ display: 'flex', alignItems: 'center', textAlign: 'center' }} key={user_id}>
                                                {avatar ? (
                                                    <img style={{ width: '28px', height: '28px', borderRadius: '50%', marginRight: '8px' }} src={avatar} />
                                                ) : (
                                                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#f5f5f5', marginRight: '8px', lineHeight: '28px', }}>
                                                            <Icon type={'user'} style={{ fontSize: 12, color: '#8c8c8c' }} />
                                                        </div>
                                                    )}
                                                <div style={{ overflow: 'hidden', verticalAlign: ' middle', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 90, marginRight: 8 }}>{name || user_name || '佚名'}</div>
                                            </div>
                                            <div style={{ display: selectedKeys.indexOf(user_id) != -1 ? 'block' : 'none' }}>
                                                <Icon type="check" />
                                            </div>
                                        </div>
                                    </Menu.Item>
                                )
                            })
                        }
                    </Menu>
                </Menu>


            </div>

        )
    }

}

MilestoneAdd.deafultProps = {

}
