import React from 'react'
import styles from './index.less'
import {exportFile} from './utils'
import globalStyles from '@/globalset/css/globalClassName.less'
import { remove } from 'js-cookie';
import WriteFile from './writeFile';
export default class PreviewTable extends React.Component{
    constructor(){
        super(...arguments);
        this.state = {
            dataSource: [],
            activeData: {
              data: []
            },
            exportData: [],
            activeIndex: 0,
            replaceLetters: [],
        }
        this.minRows = 10;
        this.minCols = 18;
        this.letters = 
        ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
    }
    componentDidMount(){
        let { data } = this.props;
        if(data && data.length){
            this.setData(data);
        }else {
            this.setDefaultValue();
        }
    }
    componentWillReceiveProps(nextProps){
        let { data } = nextProps;
        if(data && data.length){
            // console.log(data, 'tableData');
            this.setData(data);
        }
    }

    setDefaultValue = () => {
        let val = {
            name: "Sheet1",  
            config: {},
            celldata: [],
            letter: this.setLonggerLetters(this.minCols),
            data: this.setEmpty(this.minRows, this.minCols),
        }
        this.setState({
            activeData: val,
            exportData: val
        })
    }
    
    convertToTitle = (n) => {
        const arr = this.letters;
        let val = ''
        n = n + ''
        while (n > 0) {
            if (n % 26 === 0) {
            val = 'Z' + val
            n = parseInt(n / 26, 10) - 1
            } else {
            val = arr[n % 26 - 1] + val
            n = parseInt(n / 26, 10)
            }
        }
        return val
    }
    // 设置随意长度的列宽序号
    setLonggerLetters = (num)=>{
        let letter = [];
        num += 1;
        for(let i = 0; i< num ; i++){
            letter.push(this.convertToTitle(i))
        }
        return letter;
    }

    getMaxCAndR = (data)=>{
        if(data && data.length){
            // console.log(data)
            let sheets = [];
            data.forEach(item => {
            let allR = [];
            let allC = [];
            item.celldata.forEach(cell => {
                allR.push(+cell.r);
                allC.push(+cell.c);
            })
            let obj = {
                ...item,
                rows: Math.max(...allR, this.minRows) + 1,
                cols: Math.max(...allC, this.minCols) + 1,
            }
            sheets.push(obj);
            });
            return sheets;
        }
        return [];
    }
    setEmpty = (cellRows, cellCols)=>{
        let rows = [];
        for(let i = 0; i< cellRows; i ++){
            rows.push([]);
        }
        let cols = [];
        for(let i = 0; i< cellCols; i++){
            cols.push([]);
        }
        rows = rows.map(r => {
            r = (cols.map(v => null))
            return r;
        })
        return rows;
    }
    // 创建空数据
    getEmptyArrary = (data)=>{
        let cAndr = this.getMaxCAndR(data);
        // console.log(cAndr)
        let sheets =[];
        cAndr.forEach((item) => {
            let rows = this.setEmpty(item.rows, item.cols);
            let obj = {
                ...item,
                data: rows
            }
            sheets.push(obj);
        })
        return sheets;
    }
    // 格式化数据字符串的问题
    forMatNumberData = (data)=> {
        let arr = data.map(item => {
        let config = item.config;
        let {columlen, merge, rowlen} = config;
        let obj = {};
        // 修复列宽的bug
        if(columlen){
            for(let key in columlen){
            obj[key] = +columlen[key]
            }
        }

        // 修复行高的bug
        let row = {};
        if(rowlen){
            for(let key in rowlen){
            row[key] = +rowlen[key]
            }
        }

        let m = {};
        // 修复合并单元格的bug
        if(merge){
            for(let key in merge){
            let d = merge[key];
            let n = {};
            for(let dk in d){
                n[dk] = +d[dk];
            }
            m[key] = n;
            }
        }

        let celldata = item.celldata || [];
        item.celldata = celldata.map(cell => {
            // 修复显示合并单元格的bug
            let mc = cell.mc;
            cell.r = +cell.r;
            cell.c = +cell.c;
            if(mc){
            let obj = {};
            for(let key in mc){
                obj[key] = +mc[key];
            }
            cell.mc = obj;
            }
            let v = cell.v;
            if(v && typeof v === 'object'){
            let vmc = v.mc;
            if(vmc){
                let obj = {};
                for(let key in vmc){
                obj[key] = +vmc[key];
                }
                v.mc = obj;
            }
            cell.v = v;
            }
            return cell;
        })

        config.merge = m;
        config.columlen = obj;
        config.rowlen = row;
        item.config = config;
        return item;
        })
        return arr;
    }
    // 格式化数据
    forMatData = (data, flag = true) => {
        let arr = this.getEmptyArrary(data);
        arr = this.forMatNumberData(arr);
        let array = arr.map((item) => {
            let celldata = item.celldata;
            let config = item.config;
            let d = item.data;
            
            item.letter = this.setLonggerLetters(d[0].length);
                for(let i = 0; i< celldata.length; i ++){
                let cell = celldata[i];
                let r = +cell.r;
                let c = +cell.c;
                d[r][c] = cell;
            }
            let merge = config.merge;
            if(merge && flag){
                let mKeys = Object.keys(merge);
                // 保存已经删除掉的单元格数量
                let removedC = {

                }
                // 合并单元格
                mKeys.sort().forEach(conf => {
                    let r = +merge[conf].r;
                    // 已经删除了的单元格会发生长度变化，下标会失效。
                    let c = +merge[conf].c - (removedC[r] || 0);
                    let oldm = d[r][c] || {};
                    let rs = r + +merge[conf].rs;
                    for(let i = r ; i < rs ; i++){
                        d[i].splice(c, +merge[conf].cs);
                        // 保存每一行删除的个数，用来取对应的数据
                        removedC[i] = (removedC[i] || 0) + (+merge[conf].cs - 1);
                    }
                    // 将删除的数据回填到表格，通过合并单元格使用
                    d[r].splice(c, 0, { ...oldm, merge: oldm.mc ? true: false, mrs: +merge[conf].rs, mcs: +merge[conf].cs});
                })
            }
            item.data = d ;
            return item;
        })
        return array;
    }

    // 设置数据
    setData = (arr)=>{
        let data = this.forMatData(arr);
        let index = data.findIndex(item => item.status == 1);
        if(index === -1){
            index = 0;
        }
        this.setState({
            dataSource: data,
            exportData: this.forMatData(arr, false)
        })
        this.setActiveSheet(data, index);
    }

    setActiveSheet = (data, index)=>{
        this.setState({
            activeIndex: index,
            activeData: data[index]
        })
    }

    // 渲染单元格
    RenderTd = ({data, index}) => {
        let text = "";
        let style = {};
        if(data && data.v){
            text = typeof data.v === 'string' ? data.v : data.v.m ? data.v.m : data.v.v ; 
        }else 
        text = <span>&nbsp;</span>;

        if(data && data.v){
            if(typeof data.v === 'object'){
                let v = data.v;
                v.bg && (style.background = v.bg);
                v.ff && (style.fontFamily = v.ff);
                v.fc && (style.color = v.fc);
                v.it && (style.fontStyle = v.it);
                v.fs && (style.fontSize = v.fs);
            }
        }
        let merge = {
            rowSpan: 1,
            colSpan: 1
        };
        if(data && data.merge){
            merge.colSpan = data.mcs;
            merge.rowSpan = data.mrs;
        }
        return (
            <td {...merge} style={{...style, ...this.setTdStyle(index)}}>
                {text}
            </td>
        )
    }

    // 设置td的宽
    setTdStyle = (index) => {
        let data = this.state.activeData;
        let config = data.config;
        let style = {};
        if(config.columlen){
            let keys = Object.keys(config.columlen);
            keys.forEach(item => {
            if(index === +item){
                style.width = +config.columlen[item] +'px';
            }
            })
        }
        return style;
    }
    // 设置tr的行高
    setTrStyle = (index)=>{
        let data = this.state.activeData;
        let config = data.config;
        let style = {};
        if(config.rowlen){
            let keys = Object.keys(config.rowlen);
            keys.forEach(item => {
            if(index === +item){
                style.height = +config.rowlen[item] +'px';
            }
            })
        }
        return style;
    }
    // 切换sheet
    checkSheet = (index) => {
        this.setActiveSheet(this.state.dataSource, index);
    }

    render(){
        let { activeData = [], dataSource = []} = this.state;
        const { showDownload = false, leadingOutVisible = false } = this.props;
        return (
            <div className={styles.tableContainer}>
                <table cellSpacing="0" cellPadding="0" border="0">
                    <thead>
                    <tr style={{background: 'rgba(0,0,0,0.15)'}}>
                        { activeData.letter && activeData.letter.map(item => {
                        return (
                            <th key={item}>
                            {item}
                            </th>
                        )
                        })}
                    </tr>
                    </thead>
                    <tbody>
                    {
                    activeData.data.map((item, r) => {
                        return (
                        <tr key={r} className={styles.tableTr} style={this.setTrStyle(r)}>
                            <td>{r + 1}</td>
                            {
                            item.map((cell, c) => {
                                return (
                                <this.RenderTd data={cell} index={c} key={c}/>
                                )
                            })
                            }
                        </tr>
                        )
                    })
                    }
                    </tbody>
                    <tfoot style={{display: "none"}}></tfoot>
                </table>
                <div className={styles.sheetList}>
                    {
                        leadingOutVisible && (
                            <WriteFile data={this.state.exportData} buttonClass={`${globalStyles.authTheme} ${styles.exportFile}`}/>
                        )
                    }
                    { dataSource.length ? 
                        dataSource.map((item, d) => {
                            return (
                                <div className={`${styles.sheetItem} ${this.state.activeIndex === d ? styles.activeTab : ""}`} key={d} onClick={this.checkSheet.bind(this, d)}>{item.name}</div>
                            )
                        })
                        :
                        <div className={`${styles.sheetItem} ${styles.activeTab}`}>Sheet1</div>
                    }
                </div>
            </div>
        )
    }
}