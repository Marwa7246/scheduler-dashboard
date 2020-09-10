import React, { Component } from "react";
import Loading from 'components/Loading';
import Panel from 'components/Panel'

import classnames from "classnames";

const data = [
  {
    id: 1,
    label: "Total Interviews",
    value: 6
  },
  {
    id: 2,
    label: "Least Popular Time Slot",
    value: "1pm"
  },
  {
    id: 3,
    label: "Most Popular Day",
    value: "Wednesday"
  },
  {
    id: 4,
    label: "Interviews Per Day",
    value: "2.3"
  }
];

class Dashboard extends Component {
  
   
    state = { 
      loading: false,
      focused: null
     };  


    selectPanel(id) {       
      this.setState(prev=> ({focused: prev.focused ? null : id}))
    }
      
    componentDidMount() {
      const focused = JSON.parse(localStorage.getItem("focused"));
  
      if (focused) {
        this.setState({ focused });
      }
    }
  
    componentDidUpdate(previousProps, previousState) {
      if (previousState.focused !== this.state.focused) {
        localStorage.setItem("focused", JSON.stringify(this.state.focused));
      }
    }

  render() {
    const dashboardClasses = classnames("dashboard", {"dashboard--focused": this.state.focused});

    const panels = data
    .filter(panel=> this.state.focused===null || this.state.focused=== panel.id)
    .map(panel =>  {      
      return <Panel 
        key= {panel.id} 
        {...panel} 
        onSelect={()=>this.selectPanel(panel.id)}
      />
    })

    if (this.state.loading) {
      return <Loading />;
    }
    return  (
      <main className={dashboardClasses}>
          {panels}
      </main>
    );       
  }
}

export default Dashboard;
