import React, { Component } from "react";
import axios from "axios";
import Loading from "components/Loading";
import Panel from "components/Panel";
import {
  getTotalInterviews,
  getLeastPopularTimeSlot,
  getMostPopularDay,
  getInterviewsPerDay
 } from "helpers/selectors";
 import { setInterview } from "helpers/reducers";

import classnames from "classnames";


const data = [
  {
    id: 1,
    label: "Total Interviews",
    getValue: getTotalInterviews
  },
  {
    id: 2,
    label: "Least Popular Time Slot",
    getValue: getLeastPopularTimeSlot
  },
  {
    id: 3,
    label: "Most Popular Day",
    getValue: getMostPopularDay,
  },
  {
    id: 4,
    label: "Interviews Per Day",
    getValue: getInterviewsPerDay
  },
];

class Dashboard extends Component {
  state = {
    days: [],
    appointments: {},
    interviewers: {},
    loading: true,
    focused: null
  };

  selectPanel(id) {
    this.setState((prev) => ({ focused: prev.focused ? null : id }));
  }


  componentDidMount() {
    const focused = JSON.parse(localStorage.getItem("focused"));
    Promise.all([
      axios.get(`/api/days`),
      axios.get(`/api/appointments`),
      axios.get(`/api/interviewers`),
    ]).then(([days, appointments, interviewers]) => {
      this.setState({
        loading: false,
        days: days.data,
        appointments: appointments.data,
        interviewers: interviewers.data,
      });
      
      this.socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
          
      this.socket.onmessage =event => {
        const data = JSON.parse(event.data);
        if(typeof data === "object" && data.type === "SET_INTERVIEW") {
          this.setState(previousState => (setInterview(previousState, data.id, data.interview)));
        }        
      }
    });    

    if (focused) {
      this.setState({ focused });
    }
  }

  componentWillUnmount() {
    this.socket.close();
  }

  componentDidUpdate(previousProps, previousState) {
    if (previousState.focused !== this.state.focused) {
      localStorage.setItem("focused", JSON.stringify(this.state.focused));
    }
  }

  render() {
    const dashboardClasses = classnames("dashboard", {
      "dashboard--focused": this.state.focused
    });

    const panels = data
      .filter(
        (panel) =>
          this.state.focused === null || this.state.focused === panel.id
      )
      .map((panel) => {
        return (
          <Panel
            key={panel.id}
            value={panel.getValue(this.state)}
            label={panel.label}
            onSelect={() => this.selectPanel(panel.id)}
          />
        );
      });

    if (this.state.loading) {
      return <Loading />;
    }
    return <main className={dashboardClasses}>{panels}</main>;
  }
}
export default Dashboard;
