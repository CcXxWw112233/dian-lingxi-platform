import React, { Component } from "react";
import {
  timestampToTimeNormal,
  timeToTimestamp
} from "./../../../../../../utils/util";
import { DatePicker } from "antd";

class DateRangePicker extends Component {
  state = {
    start_time: "",
    due_time: ""
  };
  disabledStartTime = start_time => {
    const { due_time } = this.state;
    if (!start_time || !due_time) {
      return false;
    }
    const newDueTime =
      due_time.toString().length > 10
        ? Number(due_time).valueOf() / 1000
        : Number(due_time).valueOf();
    return Number(start_time.valueOf()) / 1000 >= newDueTime; //Number(due_time).valueOf();
  };
  startDatePickerChange(e, timeString) {
    this.setState({
      start_time: timeToTimestamp(timeString)
    }, () => {
      const {start_time, due_time} = this.state
      const {handleDateRangeChange} = this.props
      handleDateRangeChange([start_time, due_time])
    })
  }
  disabledDueTime = due_time => {
    const { start_time } = this.state;
    if (!start_time || !due_time) {
      return false;
    }

    const newStartTime =
      start_time.toString().length > 10
        ? Number(start_time).valueOf() / 1000
        : Number(start_time).valueOf();
    return Number(due_time.valueOf()) / 1000 < newStartTime;
  };
  endDatePickerChange(e, timeString) {
    this.setState({
      due_time: timeToTimestamp(timeString)
    }, () => {
      const {start_time, due_time} = this.state
      const {handleDateRangeChange} = this.props
      handleDateRangeChange([start_time, due_time])
    })
  }
  render() {
    const {start_time, due_time} = this.state
    return (
      <div>
        {start_time || due_time ? (
          ""
        ) : (
          <span style={{ color: "#bfbfbf" }}>设置</span>
        )}
        <span style={{ position: "relative", cursor: "pointer" }}>
          &nbsp;
          {start_time ? (
            timestampToTimeNormal(start_time, "/", true)
          ) : (
            <span style={{ cursor: "pointer" }}>开始</span>
          )}
          <DatePicker
            disabledDate={this.disabledStartTime.bind(this)}
            onChange={this.startDatePickerChange.bind(this)}
            placeholder={"开始时间"}
            format="YYYY/MM/DD HH:mm"
            showTime={{ format: "HH:mm" }}
            style={{
              opacity: 0,
              width: !start_time ? 16 : 100,
              height: 20,
              background: "#000000",
              cursor: "pointer",
              position: "absolute",
              right: !start_time ? 8 : 0,
              zIndex: 1
            }}
          />
        </span>
        &nbsp;
        {start_time && due_time ? (
          <span style={{ color: "#bfbfbf" }}> -- </span>
        ) : (
          <span style={{ color: "#bfbfbf" }}> -- </span>
        )}
        &nbsp;
        <span style={{ position: "relative" }}>
          {due_time ? (
            timestampToTimeNormal(due_time, "/", true)
          ) : (
            <span style={{ cursor: "pointer" }}>截止时间</span>
          )}
          <DatePicker
            disabledDate={this.disabledDueTime.bind(this)}
            placeholder={"截止时间"}
            format="YYYY/MM/DD HH:mm"
            showTime={{ format: "HH:mm" }}
            onChange={this.endDatePickerChange.bind(this)}
            style={{
              opacity: 0,
              width: !due_time ? 50 : 100,
              cursor: "pointer",
              height: 20,
              background: "#000000",
              position: "absolute",
              right: 0,
              zIndex: 1
            }}
          />
        </span>
      </div>
    );
  }
}

export default DateRangePicker;
