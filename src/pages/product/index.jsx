import React, { Component } from 'react';
import { connect } from 'react-redux';
import { holidays } from '../../data/holidays';
import axios from 'axios';
import memoryUtils from "../../utils/memoryUtils";
import {reqUsers, reqContact} from "../../api";
import {message} from "antd";
import storageUtils from "../../utils/storageUtils";

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const times = Array.from({length: 48}, (x, i) => (i + 1) / 2);

export default class Product extends Component {

    state = {
        users: [],
        mylist: [],
        timeSheetUnit: {
            timeSheetUnitID: "60786fbf38b6925c604ebfe0",
            username: "user2",
            submissionStatus: "Not Started",
            approvalStatus: "N/A",
            comments: "",
            week: [
                {
                    date: new Date(Date.parse("04-11-2021")),
                    startTime: -1,
                    endTime: -1,
                    // totalHours: 0,
                    floatingDay: false,
                    vacation: false,
                },
                {
                    date: new Date(Date.parse("04-12-2021")),
                    startTime: -1,
                    endTime: -1,
                    // totalHours: 0,
                    floatingDay: false,
                    vacation: false,
                },
                {
                    date: new Date(Date.parse("04-13-2021")),
                    startTime: -1,
                    endTime: -1,
                    // totalHours: 0,
                    floatingDay: true,
                    vacation: false,
                },
                {
                    date: new Date(Date.parse("04-14-2021")),
                    startTime: 9,
                    endTime: 18,
                    // totalHours: 0,
                    floatingDay: false,
                    vacation: false,
                },
                {
                    date: new Date(Date.parse("04-15-2021")),
                    startTime: 9,
                    endTime: 18,
                    // totalHours: 0,
                    floatingDay: false,
                    vacation: false,
                },
                {
                    date: new Date(Date.parse("04-16-2021")),
                    startTime: 9,
                    endTime: 18,
                    // totalHours: 0,
                    floatingDay: false,
                    vacation: false,
                },
                {
                    date: new Date(Date.parse("04-17-2021")),
                    startTime: -1,
                    endTime: -1,
                    // totalHours: 0,
                    floatingDay: false,
                    vacation: false,
                }
            ]
        },
        isHoliday: [],
    }

    componentDidMount() {
        // this.getUsers().then((res)=>{
        //
        // });
        this.saveUsers();
    }

    getIsHoliday() {
        let arr = [];
        for (let i = 0; i < 7; i++) {
            arr.push(this.dayIsHoliday(this.state.timeSheetUnit.week[i], holidays));
        }
        this.setState(prevState => {let h = Object.assign({}, prevState); h.isHoliday = arr; return h;});
    }

    dayIsHoliday(d, holidays) {
        let res = false;
        holidays.forEach(h => {if (d.date.toDateString() === h.date.toDateString()) {res = true;}});
        return res;
    }

    getTotalBillingHours() {
        let res = 0;
        this.state.timeSheetUnit.week.forEach(d => {res += d.endTime - d.startTime;});
        return res;
    }

    getTotalCompensatedHours() {
        let res = 0;
        this.state.timeSheetUnit.week.forEach((d, index) => {res += (d.endTime - d.startTime + (d.floatingDay || this.state.isHoliday[index] || d.vacation? 8 : 0));});
        return res;
    }

    uploadUsers = () => {
        console.log('upload.....');
        const something = this.state.timeSheetUnit;
        something.comments = "";

        console.log("something", something);
        // axios.post('api/user/saveUser', something).then(res => {
        //     console.log(res.data);
        // });
    }

    saveUsers = async () => {
        const mylista = storageUtils.getList();
        const index = storageUtils.getIndex();
        const name = memoryUtils.user.name;
        const result = await reqUsers(name);
        this.setState({mylist: mylista[index]});
        //this.setState({mylist: mylista[index].week});
        const  users  = result;
        console.log("result", result);
        console.log("mylist", this.state.mylist);
        this.setState({users: users});
    };

    render() {
        return (
            <div>
                <div>
                    <div>
                        Week Ending <input type = 'date' defaultValue = {this.state.timeSheetUnit.week[6].date.toDateString()} onChange = {(e) =>{console.log("eeeee", e.target.value)}}></input>
                        Total Billing Hours <input type = 'text' value={this.getTotalBillingHours()}></input>
                        Total Compensated Hours <input type = 'text' value={this.getTotalCompensatedHours()}></input>
                    </div>
                </div>
                <table>
                    <tbody>
                    <tr>
                        <th>Day</th>
                        <th>Date</th>
                        <th>Starting Time</th>
                        <th>Ending Time</th>
                        <th>Total Hours</th>
                        <th>Floating Day</th>
                        <th>Holiday</th>
                        <th>Vacation</th>
                    </tr>
                    {this.state.timeSheetUnit.week.map(({date, startTime, endTime, floatingDay, vacation}, index) =>
                        <tr key = {index}>
                            <td>{days[index]}</td>
                            <td>{date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear()}</td>
                            <td>
                                <select value={this.state.timeSheetUnit.week[index].startTime} onChange={(e) => this.setState(prevState => {let tsu = Object.assign({},prevState.timeSheetUnit); tsu.week[index].startTime = e.target.value; if (e.target.value === -1) {tsu.week[index].endTime = -1;}; return {tsu};})}>
                                    <option value={-1} selected = {startTime === -1}>N/A</option>
                                    {
                                        times.map((time, index) =>
                                            <option value = {time} key = {index} selected={time === startTime}>
                                                {Math.floor(time >= 13? (time - 12) : time) + ':' + (time === Math.floor(time)? '00' : '30') + ' ' + (time % 24 >= 12? 'pm' : 'am')}
                                            </option>)
                                    }
                                </select>
                            </td>
                            <td>
                                <select value={this.state.timeSheetUnit.week[index].endTime} onChange={(e) => this.setState(prevState => {let tsu = Object.assign({},prevState.timeSheetUnit); tsu.week[index].endTime = e.target.value; if (e.target.value === -1) {tsu.week[index].startTime = -1;}; return {tsu};})}>
                                    <option value={-1} selected = {startTime === -1}>N/A</option>
                                    {
                                        times.map((time, index) =>
                                            <option value = {time} key = {index} selected={time === endTime}>
                                                {Math.floor(time >= 13? (time - 12) : time) + ':' + (time === Math.floor(time)? '00' : '30') + ' ' + (time % 24 >= 12? 'pm' : 'am')}
                                            </option>)
                                    }
                                </select>
                            </td>
                            <td>{startTime === -1 || endTime === -1? 0 : (endTime - startTime)}</td>
                            <td>{floatingDay? 'X' : ''}</td>
                            <td>{this.state.isHoliday[index]? 'X' : ''}</td>
                            <td>{vacation? 'X' : ''}</td>
                        </tr>
                    )}
                    </tbody>
                </table>
                <div>
                    <select>
                        <option value = 'approved'>Approved Timesheet</option>
                        <option value = 'unapproved'>Unapproved Timesheet</option>
                    </select>
                    <input type = 'file'></input>
                </div>
                <button onClick={this.uploadUsers}>Save</button>
            </div>
            // <div>
            //     a:
            //     {this.state.mylist.map((x, i)=>{
            //         return <div key={i} className="box">
            //             <div className="name">
            //                 <span>Date: {x.date} </span>
            //                 <span></span>
            //                 <span>starttime: {x.startTime}</span>
            //                 <span>                  </span>
            //                 <span>endtime: {x.endTime}</span>
            //             </div>
            //             <div className="name"> </div>
            //         </div>
            //     })}
            // </div>
        );
    }


}
