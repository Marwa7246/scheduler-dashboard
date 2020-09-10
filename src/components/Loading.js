import React, {Component} from 'react';

class Loading extends Component {
  constructor (props) {
    super(props)
    console.log(props)
   
  }
  render () {
        return <section className="loading">Loading</section>

  }
  
}

export default Loading;