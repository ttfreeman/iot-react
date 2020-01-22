import React, { Component } from "react";
import "./App.css";
import Amplify from "aws-amplify";
import { AWSIoTProvider } from "@aws-amplify/pubsub/lib/Providers";
Amplify.configure({
  Auth: {
    identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
    region: process.env.REACT_APP_REGION,
    userPoolId: process.env.REACT_APP_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_USER_POOL_WEB_CLIENT_ID
  }
});
Amplify.addPluggable(
  new AWSIoTProvider({
    aws_pubsub_region: process.env.REACT_APP_REGION,
    aws_pubsub_endpoint: `wss://${process.env.REACT_APP_MQTT_ID}.iot.${process.env.REACT_APP_REGION}.amazonaws.com/mqtt`
  })
);

class App extends Component {
  state = {
    messages: []
  };

  componentDidMount() {
    Amplify.PubSub.subscribe("realtime-data").subscribe({
      next: data => {
        console.log("Message received", data.value["message"]);
        this.state.messages.push(data.value["message"]);
        this.setState(prevState => ({
          messages: [...prevState.messages, data.value["message"]]
        }));
      },
      error: error => console.error(error),
      close: () => console.log("Done")
    });
  }
  render() {
    console.log(process.env);
    console.log(this.state.messages);
    // console.log("this is your data: ", data.value);

    return (
      <div className="App">
        <h1>Realtime Data</h1>
        <ul>
          {this.state.messages.reverse().map((message, index) => (
            <li key={index}>
              {index}: {message}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
export default App;
