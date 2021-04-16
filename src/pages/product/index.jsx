import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import memoryUtils from "../../utils/memoryUtils";
import {reqUsers} from "../../api";
import {message} from "antd";
import storageUtils from "../../utils/storageUtils";
import DatePicker from 'react-datepicker';

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const times = Array.from({length: 48}, (x, i) => (i + 1) / 2);

export default class Product extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentIdx: 0,
            users: [],
            mylist: [],
            timeSheetUnit: {
                timeSheetUnitID: "60786fbf38b6925c604ebfe0",
                username: "user2",
                submissionStatus: "Not Started",
                approvalStatus: "N/A",
                comments: "",
                weekEnd: '2021-04-17',
                week: [
                    {
                        date: '2021-04-11',
                        startTime: -1,
                        endTime: -1,
                        // totalHours: 0,
                        floatingDay: false,
                        holiday: false,
                        vacation: false,
                    },
                    {
                        date: '2021-04-12',
                        startTime: -1,
                        endTime: -1,
                        // totalHours: 0,
                        floatingDay: false,
                        holiday: true,
                        vacation: false,
                    },
                    {
                        date: '2021-04-13',
                        startTime: -1,
                        endTime: -1,
                        // totalHours: 0,
                        floatingDay: true,
                        holiday: false,
                        vacation: false,
                    },
                    {
                        date: '2021-04-14',
                        startTime: 9,
                        endTime: 18,
                        // totalHours: 0,
                        floatingDay: false,
                        holiday: false,
                        vacation: false,
                    },
                    {
                        date: '2021-04-15',
                        startTime: 9,
                        endTime: 18,
                        // totalHours: 0,
                        floatingDay: false,
                        holiday: false,
                        vacation: false,
                    },
                    {
                        date: '2021-04-16',
                        startTime: 9,
                        endTime: 18,
                        // totalHours: 0,
                        floatingDay: false,
                        holiday: false,
                        vacation: false,
                    },
                    {
                        date: '2021-04-17',
                        startTime: -1,
                        endTime: -1,
                        // totalHours: 0,
                        floatingDay: false,
                        holiday: false,
                        vacation: false,
                    }
                ]
            }
        }
    }

    

    componentDidMount() {
        // this.getUsers().then((res)=>{
        //
        // });
        this.saveUsers();
    }

    
    getTotalBillingHours() {
        let res = 0;
        this.state.timeSheetUnit.week.forEach(d => {res += d.endTime - d.startTime;});
        return res;
    }

    getTotalCompensatedHours() {
        let res = 0;
        this.state.timeSheetUnit.week.forEach((d, index) => {res += (d.endTime - d.startTime + ((d.floatingDay == true || d.holiday == true || d.vacation == true)? 8 : 0));});
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
        // console.log(this.state.timeSheetUnit.week[0].date);
        const mylista = storageUtils.getList();
        const index = storageUtils.getIndex();
        this.setState({currentIdx: index});
        const name = memoryUtils.user.name;
        const result = await reqUsers(name);
        this.setState({mylist: mylista[index]});
        this.setState({timeSheetUnit: mylista[index]});
        //this.setState({mylist: mylista[index].week});
        const  users  = result;
        console.log("result", result);
        console.log("mylist", this.state.mylist);
        // console.log("timeSheetUnit", this.state.timeSheetUnit);
        this.setState({users: users});
        storageUtils.saveIndex(0);
    };

    chooseDate(event) {
        let chosenDate = Date.parse(event.target.value);
        let idxDiff = Math.ceil((chosenDate - Date.parse(this.state.timeSheetUnit.week[6].date))/(7 * 24 * 60 * 60 * 1000));
        let nextIdx = this.state.currentIdx - idxDiff;
        if (nextIdx < 0 || nextIdx >= storageUtils.getList().length) {
            alert("Invalid date");
        }
        else {
            storageUtils.saveIndex(nextIdx);
            this.saveUsers();
        }
    }

    render() {
        console.log(new Date('2021-04-17'));
        return (
            <div>
                <div>
                    <div>
                        {/* <div>
                         <DatePicker selected={Date.parse(this.state.timeSheetUnit.week[6].date)} placeholderText="Select a Saturday" filterDate={date => date.getDay == 6} onChange={date => console.log(date)}/>
                        </div> */}
                        <br/>
                        Week Ending <input type = 'date' value = {this.state.timeSheetUnit.week[6].date} onChange = {(e) =>{console.log("eeeee", e.target.value); this.chooseDate(e);}}></input>
                        Total Billing Hours <input type = 'text' value={this.getTotalBillingHours()}></input>
                        Total Compensated Hours <input type = 'text' value={this.getTotalCompensatedHours()}></input>
                    </div>
                </div>
                <table style={{border:"2px solid black", width:"100%"}}>
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
                    {this.state.timeSheetUnit.week.map(({date, startTime, endTime, floatingDay, holiday, vacation}, index) =>
                        <tr key = {index}>
                            <td>{days[index]}</td>
                            <td>{date.toString()}</td>
                            <td>
                                <select value={this.state.timeSheetUnit.week[index].startTime} onChange={(e) => this.setState(prevState => {let tsu = Object.assign({},prevState); tsu.timeSheetUnit.week[index].startTime = e.target.value; if (e.target.value === -1) {tsu.timeSheetUnit.week[index].endTime = -1;}; return tsu;})}>
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
                                <select value={this.state.timeSheetUnit.week[index].endTime} onChange={(e) => this.setState(prevState => {let tsu = Object.assign({},prevState); tsu.timeSheetUnit.week[index].endTime = e.target.value; if (e.target.value === -1) {tsu.timeSheetUnit.week[index].startTime = -1;}; return tsu;})}>
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
                            <td>
                                <input type = 'radio' name = {index} value = 'floatingDay' checked = {floatingDay == true} onChange={(e) => this.setState(prevState => {let st = Object.assign({}, prevState); st.timeSheetUnit.week[index].floatingDay = (e.target.value == 'floatingDay'); if (e.target.value == 'floatingDay'){st.timeSheetUnit.week[index].startTime = -1;st.timeSheetUnit.week[index].endTime =-1;}; return st;})}></input>
                            </td>
                            <td>
                                <input type = 'radio' name = {index} value = 'holiday' checked = {holiday == true} disabled></input>
                            </td>
                            <td>
                                <input type = 'radio' name = {index} value = 'vacation' checked = {vacation == true} onChange={(e) => this.setState(prevState => {let st = Object.assign({}, prevState); st.timeSheetUnit.week[index].vacation = (e.target.value == 'vacation'); if (e.target.value == 'vacation'){st.timeSheetUnit.week[index].startTime = -1;st.timeSheetUnit.week[index].endTime =-1;}; return st;})}></input>
                            </td>
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
