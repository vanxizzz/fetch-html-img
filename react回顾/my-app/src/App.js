import React, { Component } from 'react';
import propTypes from "prop-types"

 function Test(props) {
     console.log(props.a);
     console.log(props.children)
    return (
        <div>
            {props.children}
        </div>
    )
}
// Test.propTypes = {
// a: propTypes.number
// }


class App extends Component {
    state = {
        val: "dd"
    }

    render() {
        return (
            <div>
                <Test a={this.state.val} >
                    <Test/>
                </Test>
               <input type="text" value={this.state.val} onChange={(e)=>{
                   this.setState({val: e.target.value});
               }} />
            </div>
        );
    }
}

export default App;