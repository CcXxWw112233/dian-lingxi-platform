import React from 'react'
import PropTypes from 'prop-types';

export default class Sheet extends React.Component{
  constructor(){
    super(...arguments)
    this.state = {}
    this.timer = null;
  }
  componentDidMount(){
    let { data } = this.props;
    if(data && data.length){
      this.reload(data)
    }else this.init();
    window.addEventListener('resize',() => {
      clearTimeout(this.timer)
      this.timer = setTimeout(()=>{
        this.reload(this.getFormatData())
      },800)
    })
  }
  reload = (data)=>{
    window.luckysheet.method.destroy();
    this.init(data);
  }
  // 获取数据，包含表格需要的字段
  getFormatData = ()=>{
    let sheets = window.luckysheet.getluckysheetfile();
    let arr = [];
    sheets.forEach((item,index) => {
      let data = item.data;
      let celldata = [];
      data.forEach((d,r) => {
        let cells = [];
        d.forEach((val,c)=>{
          if(val){
            // 将所有数据保存到v字段，适用于更新
            val.v = {...val}
            val.r = r;
            val.c = c;
            cells.push(val)
          }
        })
        celldata = celldata.concat(cells)
      })
      // 组合成需要的数据
      let obj = {
        row: data.length,
        column: item.visibledatacolumn && item.visibledatacolumn.length,
        name: item.name,
        order: item.order,
        index: index,
        status :item.status,
        config :item.config,
        color: item.color,
        celldata
      }
      arr.push(obj)
    })
    return arr;
  }
  // 销毁表格
  destory = ()=>{
    window.luckysheet.method.destroy();
  }
  componentWillUnmount(){
    window.luckysheet.method.destroy();
  }
  init = (data)=>{
    let {
      id,
      disabledEdit ,
      showinfobar ,
      fullscreenmode,
      showtoolbar = true,
      showsheetbar = true,
      showstatisticBar = true
    } = this.props;
    data = data && data.length ? data : [{ "name": "Sheet1", color: "", "status": "1", "order": "0", "data": [], "config": {}, "index":0 }]
    window.luckysheet.method.destroy();
    window.luckysheet.create({
      container: id || 'luckysheet',
      showinfobar ,
      fullscreenmode,
      allowEdit:false,
      showtoolbar,
      showsheetbar,
      showstatisticBar,
      editMode: disabledEdit,
      data
    })
  }
  render(){
    let { id } = this.props;
    return (
      <div id={id || 'luckysheet'} style={{zIndex: 5,margin:0,padding:0,position:"absolute",top:'30px',left:0,width:"100%",height:"100%"}}></div>
    )
  }
}

Sheet.propTypes = {
  id:PropTypes.string, // 构建的sheetID
  data: PropTypes.array, // 构建时，传入的基础数据
  disabledEdit:PropTypes.bool, // 是否可以编辑
  showinfobar:PropTypes.bool,
  fullscreenmode:PropTypes.bool, // 是否全屏模式
  showtoolbar : PropTypes.bool, // 是否显示工具栏 -- 当没有权限的时候，可以不可编辑和隐藏工具栏
  showsheetbar : PropTypes.bool,// 是否显示sheet列表栏
  showstatisticBar : PropTypes.bool, //是否显示底层的计数栏
}
