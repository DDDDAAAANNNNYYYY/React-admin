import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import memoryUtils from "../../utils/memoryUtils";
import {reqContact,reqUsers} from "../../api";
import {message} from "antd";
import storageUtils from "../../utils/storageUtils";
// import DatePicker from 'react-datepicker';
import {AiFillInfoCircle} from 'react-icons/ai';

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

    setDefault = async() => {
        let newUser = null;
        axios.get("/api/user/getUser/" + this.state.username).then(res=>{
            newUser = res.data;
            let temp = this.state.timeSheetUnit.week;
            let template = [
                {startTime: temp[0].startTime + '', endTime: temp[0].endTime + '', vacation: temp[0].vacation + '', floatingDay: temp[0].floatingDay + ''},
                {startTime: temp[1].startTime + '', endTime: temp[1].endTime + '', vacation: temp[1].vacation + '', floatingDay: temp[1].floatingDay + ''},
                {startTime: temp[2].startTime + '', endTime: temp[2].endTime + '', vacation: temp[2].vacation + '', floatingDay: temp[2].floatingDay + ''},
                {startTime: temp[3].startTime + '', endTime: temp[3].endTime + '', vacation: temp[3].vacation + '', floatingDay: temp[3].floatingDay + ''},
                {startTime: temp[4].startTime + '', endTime: temp[4].endTime + '', vacation: temp[4].vacation + '', floatingDay: temp[4].floatingDay + ''},
                {startTime: temp[5].startTime + '', endTime: temp[5].endTime + '', vacation: temp[5].vacation + '', floatingDay: temp[5].floatingDay + ''},
                {startTime: temp[6].startTime + '', endTime: temp[6].endTime + '', vacation: temp[6].vacation + '', floatingDay: temp[6].floatingDay + ''}
            ]
            newUser.template = template;
            axios.post("/api/user/addUser", newUser).then(res => {
                alert("Template Saved!");
            });
        });
    }

    onFileChangeHandler = (e) => {
        e.preventDefault();
        const username = this.state.username;
        const formData = new FormData();
        formData.append('file', e.target.files[0]);
        axios.post("/api/user/upload/" + username, formData)
            .then(res => {
                alert("File uploaded successfully.")
            })
    };

    getFloatingDayComment() {
        let cnt = 0;
        this.state.timeSheetUnit.week.forEach((d, index) =>{cnt += (d.floatingDay == true? 1 : 0)});
        return (cnt == 0? "" : (cnt + " floating day(s) required;"));
    }

    getVacationComment() {
        let cnt = 0;
        this.state.timeSheetUnit.week.forEach((d, index) =>{cnt += (d.vacation == true? 1 : 0)});
        return (cnt == 0? "" : (cnt + " vacation day(s) required;"));
    }

    updateStatus = async () => {   
        // this.state;

        let st = Object.assign({}, this.state.timeSheetUnit);
        if (st.approvalStatus == 'approved') {
            st.submissionStatus = 'complete';
        }
        else {
            st.submissionStatus = 'incomplete';
        }
        st.comments = this.getFloatingDayComment() + this.getVacationComment();
        const username = memoryUtils.user.name
        console.log(this.state.timeSheetUnit.weekEnd);
        axios.post("api/user/saveUser", st).then( res=>{
          alert("Updated successfully");
        })
    
    };

    saveUsers = async () => {
        // console.log(this.state.timeSheetUnit.week[0].date);
        const mylista = storageUtils.getList();
        const index = storageUtils.getIndex();
        this.setState({currentIdx: index});
        const name = memoryUtils.user.name;
        const result = await reqUsers(name);
        this.setState({mylist: mylista[index]});
        this.setState({timeSheetUnit: this.loadTimeSheetUnit(mylista[index])});
        //this.setState({mylist: mylista[index].week});
        const  users  = result;
        console.log("result", result);
        console.log("mylist", this.state.mylist);
        // console.log("timeSheetUnit", this.state.timeSheetUnit);
        this.setState({users: users});
        storageUtils.saveIndex(0);
    };

    loadTimeSheetUnit(mylist) {
        let timeSheetUnit = Object.assign({}, mylist);
        let week = [];
        timeSheetUnit.week.forEach((d, index) => {
            week.push({
                date: d.date,
                startTime: parseFloat(d.startTime),
                endTime: parseFloat(d.endTime),
                floatingDay: d.floatingDay === 'true',
                holiday: d.holiday === 'true',
                vacation: d.vacation === 'true'
            });
        });
        timeSheetUnit.week = week;
        return timeSheetUnit;
    }

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
        return (
            <div>
                <div>
                    <div>
                        <br/>
                        Week Ending <input type = 'date' value = {this.state.timeSheetUnit.week[6].date} onChange = {(e) =>{console.log("eeeee", e.target.value); this.chooseDate(e);}}></input>
                        Total Billing Hours <input type = 'text' value={this.getTotalBillingHours()} disabled></input>
                        Total Compensated Hours <input type = 'text' value={this.getTotalCompensatedHours()} disabled></input>
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
                                <select disabled={this.state.timeSheetUnit.submissionStatus == 'complete'} value={this.state.timeSheetUnit.week[index].startTime} onChange={(e) => this.setState(prevState => {let tsu = Object.assign({},prevState); tsu.timeSheetUnit.week[index].startTime = e.target.value; if (e.target.value === -1) {tsu.timeSheetUnit.week[index].endTime = -1;}; return tsu;})}>
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
                                <select disabled={this.state.timeSheetUnit.submissionStatus == 'complete'} value={this.state.timeSheetUnit.week[index].endTime} onChange={(e) => this.setState(prevState => {let tsu = Object.assign({},prevState); tsu.timeSheetUnit.week[index].endTime = e.target.value; if (e.target.value === -1) {tsu.timeSheetUnit.week[index].startTime = -1;}; return tsu;})}>
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
                                <input type = 'radio' name = {index} value = 'floatingDay' checked = {floatingDay == true} disabled={this.state.timeSheetUnit.submissionStatus === 'complete' || this.state.timeSheetUnit.week[index].holiday == true} onChange={(e) => this.setState(prevState => {let st = Object.assign({}, prevState); st.timeSheetUnit.week[index].floatingDay = (e.target.value === 'floatingDay'); if (e.target.value === 'floatingDay'){st.timeSheetUnit.week[index].startTime = -1;st.timeSheetUnit.week[index].endTime =-1;}; return st;})}></input>
                            </td>
                            <td>
                                <input type = 'radio' name = {index} value = 'holiday' checked = {holiday == true} disabled={true}></input>
                            </td>
                            <td>
                                <input type = 'radio' name = {index} value = 'vacation' checked = {vacation == true} disabled={this.state.timeSheetUnit.submissionStatus === 'complete' || this.state.timeSheetUnit.week[index].holiday == true} onChange={(e) => this.setState(prevState => {let st = Object.assign({}, prevState); st.timeSheetUnit.week[index].vacation = (e.target.value === 'vacation'); if (e.target.value === 'vacation'){st.timeSheetUnit.week[index].startTime = -1;st.timeSheetUnit.week[index].endTime =-1;}; return st;})}></input>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
                <button onClick={this.setDefault} disabled={this.state.timeSheetUnit.submissionStatus == 'complete'} title='Save daily hours as default; future weekly timesheet will show same hours.'>Set Default <AiFillInfoCircle style={{}}></AiFillInfoCircle></button>
                <div>
                    <select disabled={this.state.timeSheetUnit.submissionStatus == 'complete'} value={this.state.timeSheetUnit.approvalStatus} onChange={(e) => this.setState(prevState => {let st = Object.assign({}, prevState); st.timeSheetUnit.approvalStatus = e.target.value; console.log(this.state);return st;})}>
                        <option value = 'approved'>Approved Timesheet</option>
                        <option value = 'not approved'>Unapproved Timesheet</option>
                    </select>
                    <input type = 'file' onChange={(e)=>{this.onFileChangeHandler(e)}} disabled={this.state.timeSheetUnit.submissionStatus == 'complete'}></input>
                </div>
                <button onClick={this.updateStatus} disabled={this.state.timeSheetUnit.submissionStatus == 'complete'}>Save</button>
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
