import React, { Component } from "react";
import "./App.css";

import * as api from "./api";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {codeName: "", origin: ""};
  }

  componentDidMount() {
    api.asyncSelectRandomCodeName()
      .then(codeNameArray => this.setState({codeName: codeNameArray[0], origin: codeNameArray[1]}));
  }

  render() {
    return (
      <div className="App">
        {`Your new project code name is "${this.state.codeName}".`}<br/>{`It was also orginally used for ${this.state.origin}.`}
      </div>
    );
  }
}

export default App;
