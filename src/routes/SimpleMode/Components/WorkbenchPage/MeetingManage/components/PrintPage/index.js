import { Button, Col, Row, Select } from 'antd'
import ReactDOM from 'react-dom'
import React from 'react'
import styles from './index.less'
// import { dateFormat } from '../../../../../../../utils/util'
import PrintTable from './print_table'

export default class PrintPage extends React.PureComponent {
  state = {
    step: 5,
    pages: []
  }
  option_steps = [5, 8, 10, 13, 15, 18, 20]
  componentDidMount() {
    // console.log(this.props)
    this.SplitArr()
  }

  createStyle = () => {
    let style = document.createElement('style')
    style.innerHTML = `
    .prnt_body{
      width: 768px;
      margin: 0 auto;
      margin-bottom: 30px;
      // page-break-inside: avoid;
      break-before: page;
      break-after: page;
      page-break-after: always;
      page-break-before: always;
      position: relative;
      // page-break-after:always;
      // break-inside: auto;
    }
    .print-after{
      page-break-after: always;
    }
    .print-before{
      page-break-before: always;
    }
    // table tr {
    //   page-break-before: always;
    //   page-break-after: always;
    //   page-break-inside: avoid;
    // }
    .operation_btns{
      position: absolute;
      right: 10px;
      top: 10px;
    }
    .operation_btns .tableSize{
      width: 100px;
    }
    @media print {
      .prnt_body{
        width: 100%;
        margin: 0 auto;
      }
      .operation_btns{
        display: none;
      }
    }
    .print_title{
      text-align: center;
      font-weight: bold;
      font-size: 1.1rem;
      margin-top: 10px;
    }
    .order_propertys{
      margin-bottom: 10px;
      margin-top: 15px;
    }
    .order_propertys > div{
      margin-bottom: 10px;
    }
    .order_table{
      margin-top: 20px;
    }
    .order_table table{
      border-collapse:collapse;
      width: 100%;
      text-align: left;
    }
    .order_table table td, .order_table table th{
      padding: 8px 10px;
      border-bottom:1px solid rgba(0,0,0,0.6);
    }
    .notsettlement{
      color: rgba(255, 129, 129, 1);
    }
    .settlement{
      color:  rgba(70, 164, 125, 1);
    }
    .footer_page{
      text-align: right;
      margin-top: 15px;
    }
    `
    return style
  }

  print = () => {
    const { onPrintEnd } = this.props
    // window.print()
    let dom = ReactDOM.findDOMNode(this)
    let nw = window.open('', '', 'width=1000,height=600')
    let s = this.createStyle()
    let styleDoms = document.querySelectorAll('style')
    let sm = null
    for (let i = 0; i < styleDoms.length; i++) {
      let item = styleDoms[i]
      if (
        item.innerText.indexOf('.ant-col') !== -1 ||
        item.innerText.indexOf('.ant-row-flex') !== -1
      ) {
        nw.document.head.appendChild(item.cloneNode())
      }
    }
    nw.document.head.appendChild(s)
    let child = dom.querySelectorAll('.' + styles.prnt_body)
    if (child && child.length) {
      child.forEach(item => {
        item.classList.add('prnt_body')
        nw.document.body.appendChild(item)
      })
    }
    setTimeout(() => {
      nw.print()
      onPrintEnd && onPrintEnd()
    }, 10)
  }

  // 切割表格数据
  SplitArr = () => {
    const { tableData = [] } = this.props
    let { step } = this.state
    let p = []
    let numbers = Math.ceil(tableData.length / step)
    for (let index = 0; index < numbers; index++) {
      let arr = tableData.slice(index * step, index * step + step)
      p.push(arr)
    }
    this.setState(
      {
        pages: p
      },
      () => {
        this.print()
      }
    )
  }

  renderTables = () => {
    const { printData, tableColumns } = this.props
    const { pages } = this.state
    return pages.map((item, index) => {
      return (
        <PrintTable
          key={`page_${index}`}
          tableData={item}
          number={index + 1}
          totalNumber={pages.length}
          tableColumns={tableColumns}
          printData={printData}
        />
      )
    })
  }

  render() {
    return ReactDOM.createPortal(
      <div className={styles.container}>
        {/* <div className={styles.operation_btns}>
          <Select defaultValue={5} className={styles.tableSize}>
            {this.option_steps.map(item => {
              return (
                <Select.Option value={item} key={item}>
                  {item}条/页
                </Select.Option>
              )
            })}
          </Select>
          <Button onClick={() => this.print()}>打印</Button>
        </div> */}
        {this.renderTables()}
      </div>,
      document.body
    )
  }
}
