import React, { Component } from 'react';
import { Popover, Tooltip, Switch, Menu, Dropdown, Button, Modal } from 'antd';
import styles from './index.less';
import globalStyles from './../../../../globalset/css/globalClassName.less';
import AvatarList from './AvatarList/index';
import classNames from 'classnames/bind';
import InviteOthers from './../InviteOthers/index';

let cx = classNames.bind(styles);

class VisitControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisitControl: false,
      addMemberModalVisible: false,
      visible: false,
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
  handleInviteMemberReturnResult = members => {
    console.log(members, 'members');
  };
  handleToggleVisitControl = checked => {
    this.setState(state => {
      const { isVisitControl } = state;
      return {
        isVisitControl: !isVisitControl
      };
    });
  };
  onPopoverVisibleChange = visible => {
    const isClose = visible === false;
    const { addMemberModalVisible } = this.state;
    //关闭页面中的其他 弹窗 会影响到 popover 的状态，这里以示区分。
    if (isClose && !addMemberModalVisible) {
      this.setState({
        visible: false
      });
    }
  };
  handleClickedOtherPsersonListItem = item => {
    console.log('clicked item :' + item);
  };
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
  renderPopoverTitle = () => {
    const { isVisitControl } = this.state;
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
          {isVisitControl ? clockIcon : unClockIcon}
          <span className={styles.title__text_content}>访问控制</span>
        </span>
        <span className={styles.title__operator}>
          <Switch
            checked={isVisitControl}
            onChange={this.handleToggleVisitControl}
          />
        </span>
      </div>
    );
  };
  renderOtherPersonOperatorMenu = () => {
    const { Item } = Menu;
    const operators = new Map([
      ['editable', '可编辑'],
      ['commentable', '可评论'],
      ['readonly', '仅查看'],
      ['remove', '移除']
    ]);

    const menuItemClass = item =>
      cx({
        [styles.content__othersPersonList_Item_operator_dropdown_menu_item]: true,
        [styles.red_color]: item === 'remove' ? true : false
      });

    return (
      <Menu>
        {[...operators].map(([key, value]) => (
          <Item key={key}>
            <div className={menuItemClass(key)}>
              <span>{value}</span>
            </div>
          </Item>
        ))}
      </Menu>
    );
  };
  renderPopoverContent = () => {
    return (
      <div className={styles.content__wrapper}>
        <div className={styles.content__list_wrapper}>
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
                <AvatarList.Item
                  tips="Jake"
                  src="https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png"
                />
                <AvatarList.Item
                  tips="Andy"
                  src="https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png"
                />
                <AvatarList.Item
                  tips="Niko"
                  src="https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png"
                />
                <AvatarList.Item
                  tips="Niko"
                  src="https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png"
                />
                <AvatarList.Item
                  tips="Niko"
                  src="https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png"
                />
                <AvatarList.Item
                  tips="Niko"
                  src="https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png"
                />
              </AvatarList>
            </span>
            <span className={styles.content__principalList_info}>
              12位任务负责人
            </span>
          </div>
          <div className={styles.content__othersPersonList_wrapper}>
            {Array.from({ length: 8 }, (_, index) => index).map(item => (
              <div
                key={item}
                className={styles.content__othersPersonList_Item_wrapper}
              >
                <span className={styles.content__othersPersonList_Item_info}>
                  <img
                    width="20"
                    height="20"
                    src="https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png"
                    alt=""
                    className={styles.content__othersPersonList_Item_avatar}
                  />
                  <span className={styles.content__othersPersonList_Item_name}>
                    nameeeeeeeeee
                  </span>
                </span>
                <Dropdown
                  trigger={['click']}
                  overlay={this.renderOtherPersonOperatorMenu()}
                >
                  <span
                    onClick={() => this.handleClickedOtherPsersonListItem(item)}
                    className={styles.content__othersPersonList_Item_operator}
                  >
                    <span
                      className={
                        styles.content__othersPersonList_Item_operator_text
                      }
                    >
                      仅查看
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
        </div>
        <div className={styles.content__addMemberBtn_wrapper}>
          <Button type="primary" block onClick={this.handleAddNewMember}>
            添加成员
          </Button>
        </div>
      </div>
    );
  };
  render() {
    const { tooltipUnClockText, tooltipClockText } = this.props;
    const { isVisitControl, addMemberModalVisible, visible } = this.state;
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
          placement="bottom"
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
            {isVisitControl ? clockEle : unClockEle}
          </span>
        </Popover>
        <Modal
          visible={addMemberModalVisible}
          footer={null}
          zIndex={1099}
          onCancel={this.handleCloseAddMemberModal}
        >
          <InviteOthers
            title="邀请他人一起参与"
            isShowTitle={true}
            submitText="    确定    "
            handleInviteMemberReturnResult={this.handleInviteMemberReturnResult}
            isDisableSubmitWhenNoSelectItem={true}
          />
        </Modal>
      </div>
    );
  }
}

VisitControl.defaultProps = {
  tooltipUnClockText: '访问控制',
  tooltipClockText: '关闭访问控制'
};

export default VisitControl;
