import React, { Component } from 'react';
import {
  Popover,
  Tooltip,
  Switch,
  Menu,
  Dropdown,
  Button,
  Modal,
  message
} from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import globalStyles from './../../../../globalset/css/globalClassName.less';
import AvatarList from './AvatarList/index';
import InviteOthers from './../InviteOthers/index';
import defaultUserAvatar from './../../../../assets/invite/user_default_avatar@2x.png';
import { inviteNewUserInProject } from './../../../../services/technological/index';
import {fetchUsersByIds} from './../../../../services/organization/index'
import classNames from 'classnames/bind'

let cx = classNames.bind(styles)
@connect(({ technological }) => ({
  currentOrgAllMembersList: technological.datas.currentOrgAllMembersList
}))
class VisitControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // isVisitControl: props.isPropVisitControl, //之所以要有这个变量，是因为在UI上，需要实现当 popover 关闭的时候，才将 visitControl 的状态传过去
      loadingIsVisitControl: false, //可能需要一些异步的东西，所以有loading状态
      addMemberModalVisible: false,
      comfirmRemoveModalVisible: false,
      visible: false,
      selectedOtherPersonId: '', //当前选中的外部邀请人员的 id
      othersPersonList: [] //外部邀请人员的list
      // 格式
      // {
      //   id: '0',
      //   name: 'zhangshan',
      //   avatar:
      //     'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png',
      //   privilege: 'edit'
      // },
    };
  }
  togglePopoverVisible = e => {
    if (e) e.stopPropagation();
    this.setState(state => {
      const { visible } = state;
      return {
        visible: !visible
      };
    });
  };
  isValidAvatar = (avatarUrl = '') =>
    avatarUrl.includes('http://') || avatarUrl.includes('https://');
  // async testAsync(ms) {
  //   return await new Promise(resolve => {
  //     return setTimeout(resolve, ms);
  //   });
  // }

  handleGetAddNewMember = members => {
    const { handleAddNewMember } = this.props;
    const filterPlatformUsersId = users =>
      users.filter(u => u.type === 'platform').map(u => u.id);
    this.handleNotPlatformMember(members)
      .then(usersId => [...usersId, ...filterPlatformUsersId(members)])
      .then(ids => handleAddNewMember(ids));
  };
  async handleNotPlatformMember(members) {
    const isNotPlatformMember = m => m.type === 'other';
    const users = members
      .filter(m => isNotPlatformMember(m))
      .reduce((acc, curr) => {
        if (!acc) return curr.user;
        return `${acc},${curr.user}`;
      }, '');
    if (!users) return Promise.resolve([]);
    let res = await inviteNewUserInProject({ data: users });
    if (!res || res.code !== '0') {
      message.error('注册平台外用户失败.');
      return Promise.resolve([]);
    }
    let usersId = res.data.map(u => u.id);
    return Promise.resolve(usersId);
  }
  handleInviteMemberReturnResult = members => {
    this.handleGetAddNewMember(members);
    this.setState({
      addMemberModalVisible: false
    });
  };
  handleToggleVisitControl = checked => {
    const {handleVisitControlChange} = this.props
      handleVisitControlChange(checked)
  };
  onPopoverVisibleChange = visible => {
    const isClose = visible === false;
    const { addMemberModalVisible, comfirmRemoveModalVisible } = this.state;
    //关闭页面中的其他 弹窗 会影响到 popover 的状态，这里以示区分。
    if (isClose && !addMemberModalVisible && !comfirmRemoveModalVisible) {
      this.setState(
        {
          visible: false
        },
        () => {
          // const { isPropVisitControl, handleVisitControlChange } = this.props;
          // const { isVisitControl } = this.state;
          // if (isVisitControl !== isPropVisitControl) {
          //   handleVisitControlChange(isVisitControl);
          // }
        }
      );
    }
  };
  handleClickedOtherPersonListItem = item => {
    this.setState({
      selectedOtherPersonId: item
    });
  };
  handleSelectedOtherPersonListOperatorItem = ({ _, key }) => {
    const operatorType = key;
    const { handleClickedOtherPersonListOperatorItem } = this.props;
    const { selectedOtherPersonId } = this.state;

    //这里之所以要把这个确认 modal 放在这里，而不是放在父组件中去处理，是因为
    //确认 Modal 的visible 会影响 本组件的 visible 状态
    if(operatorType === 'remove') {
      return this.setState({
        comfirmRemoveModalVisible: true,
      })
    }
    handleClickedOtherPersonListOperatorItem(
      selectedOtherPersonId,
      operatorType
    );
  };
  handleComfirmRemoveModalOk = e => {
    if(e) e.stopPropagation()
    const {handleClickedOtherPersonListOperatorItem} = this.props
    const { selectedOtherPersonId } = this.state;
    this.setState({
      comfirmRemoveModalVisible: false,
    }, () => {
      handleClickedOtherPersonListOperatorItem(
        selectedOtherPersonId,
        'remove'
      );
    })
  }
  handleCloseComfirmRemoveModal = e => {
    if(e) e.stopPropagation()
    this.setState({
      comfirmRemoveModalVisible: false
    })
  }
  handleCloseAddMemberModal = e => {
    if (e) e.stopPropagation();
    this.setState({
      addMemberModalVisible: false
    });
  };
  handleAddNewMember = () => {
    this.setState({
      addMemberModalVisible: true
    });
  };
  parseOtherPrivileges = otherPrivilege => {
    const { currentOrgAllMembersList } = this.props;
    console.log(currentOrgAllMembersList, 'currentOrgAllMembersList')
    const isEachMemberInOtherPrivilegeCanFoundInCurrentOrgAllMembersList = currentOrgAllMembersList => Object.keys(
      otherPrivilege
    ).every(item => currentOrgAllMembersList.find(each => each.id === item));
    //如果现有的组织成员列表，不包括所有的人，那么就更新组织成员列表
    let allMember = [...currentOrgAllMembersList]
    const getOthersPersonList = allMember => Object.entries(otherPrivilege).reduce(
      (acc, curr) => {
        const [id, privilageType] = curr;
        const currPerson = allMember.find(
          item => item.id === id
        );
        const obj = {
          id: currPerson.id,
          name: currPerson.full_name,
          avatar:
            currPerson.avatar && this.isValidAvatar(currPerson.avatar)
              ? currPerson.avatar
              : defaultUserAvatar,
          privilege: privilageType
        };
        return [...acc, obj];
      },
      []
    );
    if (!isEachMemberInOtherPrivilegeCanFoundInCurrentOrgAllMembersList(currentOrgAllMembersList)) {
            const notFoundInOrgAllMembersListMembers = Object.keys(otherPrivilege).filter(item => !currentOrgAllMembersList.find(each => each.id === item))
            fetchUsersByIds({
              ids: notFoundInOrgAllMembersListMembers.reduce((acc, curr) => {
                if(!acc) return curr
                return `${acc},${curr}`
              }, '')
            }).then(res => {
              const isApiOk = res => res && res.code === '0'
              if(isApiOk(res)) {
                const getName = user => user.full_name ? user.full_name : user.mobile ? user.mobile : user.email ? user.email : user.name ? user.name : 'unknown'
              const otherMemberList = res.data.map(u => ({id: u.id, avatar: u.avatar ? u.avatar : '', full_name: getName(u)}))
               allMember = [...otherMemberList, ...allMember]
                return this.setState({
                  othersPersonList: getOthersPersonList(allMember)
                })
              } else {
                message.error('访问控制中有非该组织成员的人');
            return;
              }
            })

      } else {
        this.setState({
          othersPersonList: getOthersPersonList(allMember)
        });
        }

  };
  compareOtherPrivilegeInPropsAndUpdateIfNecessary = nextProps => {
    const { otherPrivilege: nextOtherPrivilege } = nextProps;
    const { otherPrivilege } = this.props;
    const isTheSameOtherPrivilege = (otherPrivilege1, otherPrivilege2) => {
      const objToEntries = obj => Object.entries(obj);
      const isTheSameLength = (arr1 = [], arr2 = []) =>
        arr1.length === arr2.length;
      const isEntriesSubset = (arr1 = [], arr2 = []) =>
        arr1.every(([key1, value1]) =>
          arr2.find(([key2, value2]) => key1 === key2 && value1 === value2)
        );
      const otherPrivilege1Entries = objToEntries(otherPrivilege1);
      const otherPrivilege2Entries = objToEntries(otherPrivilege2);
      if (
        isTheSameLength(otherPrivilege1Entries, otherPrivilege2Entries) &&
        isEntriesSubset(otherPrivilege1Entries, otherPrivilege2Entries)
      ) {
        return true;
      }
      return false;
    };
    if (!isTheSameOtherPrivilege(otherPrivilege, nextOtherPrivilege)) {
      console.log('=====================------ parseOtherPrivileges again-------========================')
      this.parseOtherPrivileges(nextOtherPrivilege);
    }
  };
  componentDidMount() {
    //将[id]:privilageType 对象转化为数组
    const { otherPrivilege } = this.props;
    console.log(otherPrivilege, 'otherPrivilegeotherPrivilegeotherPrivilegeotherPrivilege')
    this.parseOtherPrivileges(otherPrivilege);
  }
  componentWillReceiveProps(nextProps) {
    this.compareOtherPrivilegeInPropsAndUpdateIfNecessary(nextProps);
  }
  renderPopoverTitle = () => {
    const {isPropVisitControl} = this.props
    const unClockIcon = (
      <i className={`${globalStyles.authTheme} ${styles.title__text_icon}`}>
        &#xe86b;
      </i>
    );
    const clockIcon = (
      <i className={`${globalStyles.authTheme} ${styles.title__text_icon}`}>
        &#xe86a;
      </i>
    );
    return (
      <div className={styles.title__wrapper}>
        <span className={styles.title__text_wrapper}>
          {isPropVisitControl ? clockIcon : unClockIcon}
          <span className={styles.title__text_content}>访问控制</span>
        </span>
        <span className={styles.title__operator}>
          <Switch
            checked={isPropVisitControl}
            onChange={this.handleToggleVisitControl}
          />
        </span>
      </div>
    );
  };
  renderOtherPersonOperatorMenu = (privilege) => {
    const { otherPersonOperatorMenuItem } = this.props;
    const { Item } = Menu;
    return (
      <Menu onClick={this.handleSelectedOtherPersonListOperatorItem}>
        {otherPersonOperatorMenuItem.map(({ key, value, style }) => {

          const itemClass = cx({
            content__othersPersonList_Item_operator_dropdown_menu_item: true,
            content__othersPersonList_Item_operator_dropdown_menu_item_disabled: value === privilege ? true : false
          })
          return(<Item key={value}>
            <div
              onClick={value === privilege ? (e) => e.stopPropagation() : () => {}}
              className={itemClass}
              style={style ? style : {}}
            >
              <span>{key}</span>
            </div>
          </Item>
        )})}
      </Menu>
    );
  };
  renderPopoverContentPrincipalList = () => {
    const { principalList, principalInfo } = this.props;
    return (
      <div className={styles.content__principalList_wrapper}>
        <span className={styles.content__principalList_icon}>
          <AvatarList
            size="mini"
            maxLength={10}
            excessItemsStyle={{
              color: '#f56a00',
              backgroundColor: '#fde3cf'
            }}
          >
            {principalList.map(({ name, avatar }, index) => (
              <AvatarList.Item
                key={index}
                tips={name}
                src={this.isValidAvatar(avatar) ? avatar : defaultUserAvatar}
              />
            ))}
          </AvatarList>
        </span>
        <span className={styles.content__principalList_info}>
          {`${principalList.length}${principalInfo}`}
        </span>
      </div>
    );
  };
  renderPopoverContentOthersPersonList = () => {
    const { otherPersonOperatorMenuItem } = this.props;
    const { othersPersonList } = this.state;
    return (
      <div className={styles.content__othersPersonList_wrapper}>
        {othersPersonList.map(({ id, name, avatar, privilege }) => (
          <div
            key={id}
            className={styles.content__othersPersonList_Item_wrapper}
          >
            <span className={styles.content__othersPersonList_Item_info}>
              <img
                width="20"
                height="20"
                src={avatar}
                alt=""
                className={styles.content__othersPersonList_Item_avatar}
              />
              <span className={styles.content__othersPersonList_Item_name}>
                {name}
              </span>
            </span>
            <Dropdown
              trigger={['click']}
              overlay={this.renderOtherPersonOperatorMenu(privilege)}
            >
              <span
                onClick={() => this.handleClickedOtherPersonListItem(id)}
                className={styles.content__othersPersonList_Item_operator}
              >
                <span
                  className={
                    styles.content__othersPersonList_Item_operator_text
                  }
                >
                  {
                    otherPersonOperatorMenuItem.find(
                      item => item.value === privilege
                    ).key
                  }
                </span>
                <span
                  className={`${globalStyles.authTheme} ${
                    styles.content__othersPersonList_Item_operator_icon
                  }`}
                >
                  &#xe7ee;
                </span>
              </span>
            </Dropdown>
          </div>
        ))}
      </div>
    );
  };
  renderPopoverContentAddMemberBtn = () => {
    return (
      <div className={styles.content__addMemberBtn_wrapper}>
        <Button type="primary" block onClick={this.handleAddNewMember}>
          添加成员
        </Button>
      </div>
    );
  };
  renderPopoverContentNoContent = () => {
    return (
      <div className={styles.content__noConten_wrapper}>
        <div className={styles.content__noConten_img} />
        <div className={styles.content__noConten_text}>暂无人员</div>
      </div>
    );
  };
  isCurrentHasNoMember = () => {
    const { principalList } = this.props;
    const { othersPersonList } = this.state;
    return principalList.length === 0 && othersPersonList.length === 0;
  };
  renderPopoverContent = () => {
    return (
      <div className={styles.content__wrapper}>
        <div className={styles.content__list_wrapper}>
          {this.isCurrentHasNoMember() ? (
            <>{this.renderPopoverContentNoContent()}</>
          ) : (
            <>
              {this.renderPopoverContentPrincipalList()}
              {this.renderPopoverContentOthersPersonList()}
            </>
          )}
        </div>
        {this.renderPopoverContentAddMemberBtn()}
      </div>
    );
  };
  render() {
    const {
      tooltipUnClockText,
      tooltipClockText,
      isPropVisitControl,
      removeMemberPromptText,
      popoverPlacement
    } = this.props;
    const { addMemberModalVisible, visible, comfirmRemoveModalVisible } = this.state;
    const unClockEle = (
      <Tooltip title={tooltipUnClockText}>
        <i className={`${globalStyles.authTheme} ${styles.trigger__icon}`}>
          &#xe86b;
        </i>
      </Tooltip>
    );
    const clockEle = (
      <Tooltip title={tooltipClockText}>
        <span className={styles.trigger__btn__wrapper}>
          <i
            className={`${globalStyles.authTheme} ${styles.trigger__btn__icon}`}
          >
            &#xe86a;
          </i>
          <span className={styles.trigger__btn_text}>访问控制</span>
        </span>
      </Tooltip>
    );
    return (
      <div className={styles.wrapper}>
        <Popover
          placement={popoverPlacement}
          title={this.renderPopoverTitle()}
          content={this.renderPopoverContent()}
          trigger="click"
          visible={visible}
          onVisibleChange={this.onPopoverVisibleChange}
        >
          <span
            className={styles.trigger__wrapper}
            onClick={e => this.togglePopoverVisible(e)}
          >
            {isPropVisitControl ? clockEle : unClockEle}
          </span>
        </Popover>
        <Modal
          visible={addMemberModalVisible}
          destroyOnClose={true}
          footer={null}
          zIndex={1099}
          onCancel={this.handleCloseAddMemberModal}
        >
          <InviteOthers
            title="邀请他人一起参与"
            isShowTitle={true}
            submitText="确定"
            handleInviteMemberReturnResult={this.handleInviteMemberReturnResult}
            isDisableSubmitWhenNoSelectItem={true}
          />
        </Modal>
        <Modal
          visible={comfirmRemoveModalVisible}
          destroyOnClose={true}
          zIndex={1100}
          onCancel={this.handleCloseComfirmRemoveModal}
          onOk={this.handleComfirmRemoveModalOk}
          title='确定要移出此用户吗?'
        >
          <p>{removeMemberPromptText}</p>
        </Modal>
      </div>
    );
  }
}

VisitControl.defaultProps = {
  popoverPlacement: 'bottomRight',
  tooltipUnClockText: '访问控制',
  tooltipClockText: '关闭访问控制',
  isPropVisitControl: true,
  handleVisitControlChange: function() {
    message.error('handleVisitControlChange is required. ');
  },
  principalInfo: '位任务负责人', //已有权限人提示信息
  principalList: [
    //负责人列表
    // {
    //   name: 'Jake',
    //   avatar:
    //     'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png'
    // }
  ],
  otherPersonOperatorMenuItem: [
    {
      key: '可编辑',
      value: 'edit'
    },
    {
      key: '可评论',
      value: 'comment'
    },
    {
      key: '仅查看',
      value: 'read'
    },
    {
      key: '移出',
      value: 'remove',
      style: {
        color: '#f73b45'
      }
    }
  ],
  otherPrivilege: {},
  handleClickedOtherPersonListOperatorItem: function() {
    //点击选中邀请进来的外部人员的下拉菜单项目的回调函数
  },
  handleAddNewMember: function() {
    //...          //添加成员返回的 成员id 数组
  },
  removeMemberPromptText: '移出后用户将不能访问此内容',
};

export default VisitControl;
