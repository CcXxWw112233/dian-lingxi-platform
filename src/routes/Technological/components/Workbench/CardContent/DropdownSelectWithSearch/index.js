import React, { Component } from "react";
import { Menu, Dropdown, Input } from "antd";
import classNames from "classnames/bind";
import styles from "./index.less";
import MenuItem from "antd/lib/menu/MenuItem";

let cx = classNames.bind(styles);

class DropdownSelectWithSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      inputValue: "",
      filteredList: this.props.list ? this.props.list : [],
    };
  }
  handleVisibleChange = flag => {
    this.setState({
      visible: flag
    });
  };
  handleInputValueChange = e => {
    const {list} = this.props
    if(!e.target.value) {
      this.setState({
        inputValue: '',
        filteredList: Array.isArray(list) ? list : []
      })
    }else{
      this.setState({
        inputValue: e.target.value,
        filteredList: Array.isArray(list) ? list.filter(item => item['board_name'].includes(e.target.value)) : []
      })
    }
  };
  handleSeletedMenuItem = (item) => {
    const {handleSelectedItem, list} = this.props
    handleSelectedItem(item)
    this.setState({
      inputValue: '',
      visible: false,
      filteredList: Array.isArray(list) ? list : []
    })

  }
  renderMenuItem = filteredList => {
    return filteredList.map((item, index) => (
      <Menu.Item key={item.board_id}>
        <p onClick={this.handleSeletedMenuItem.bind(this, item)}>{item.board_name}</p>
      </Menu.Item>
    ));
  };
  render() {
    const { initSearchTitle, selectedItem } = this.props;
    const { visible, filteredList, inputValue } = this.state;
    let titleClassName = cx({
      title: true,
      active: visible
    });

    const content = (
      <div>
        <Input
          placeholder="搜索"
          value={inputValue}
          onChange={this.handleInputValueChange}
        />
        <Menu
          defaultSelectedKeys={selectedItem.board_id ? [selectedItem.board_id] : []}
        >
          {/* <Menu.Item key="0">
            <a href="http://www.alipay.com/">1st menu item</a>
          </Menu.Item>
          <Menu.Item key="1">
            <a href="http://www.taobao.com/">2nd menu item</a>
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item key="3">3rd menu item</Menu.Item> */}
          {this.renderMenuItem(filteredList)}
        </Menu>
      </div>
    );
    return (
      <div className={styles.wrapper}>
        <Dropdown
          overlay={content}
          trigger={["click"]}
          visible={visible}
          onVisibleChange={this.handleVisibleChange}
        >
          <div className={titleClassName}>
            <p>
              <span />
              <span>{selectedItem.board_name ? selectedItem.board_name : initSearchTitle}</span>
              <span />
            </p>
          </div>
        </Dropdown>
      </div>
    );
  }
}

DropdownSelectWithSearch.defaultProps = {
  initSearchTitle: "default",
  list: []
};

export default DropdownSelectWithSearch;
