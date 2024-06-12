import React, { useState, useEffect, Fragment } from 'react';
import mqtt from 'mqtt';

const CarControl: React.FC = () => {
  const [mesg, setMesg] = useState(<Fragment><em>nothing heard</em></Fragment>);
  const [inputValue, setInputValue] = useState('');
  const [client, setClient] = useState(null);

  const brokerUrl = 'ws://34.121.97.129:8083/mqtt';
  const options = {
    clean: true,
    clientId: "control" + Math.random().toString(16).substring(2, 8),
    username: 'autito_app',
    password: 'autito_app',
    protocolVersion: 5,
  };

  useEffect(() => {
    setClient(mqtt.connect(brokerUrl, options));
  }, []);

  useEffect(() => {
    if(client) {
      client.on('connect', () => {
        console.log('connected');
        client.subscribe('autito/#');
      });
      client.on('message', (topic, message) => {
        const note = message.toString();
        setMesg(note);
        console.log(note);
      });
    }
    return () => {
      if(client) {
        client.end(() => {
          console.log('disconnected');
        });
      }
    }
  }, [client]);

  const sendMessage = () => {
    if(client) {
      client.publish('autito/send', inputValue);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>A taste of MQTT in React</h1>
        <p>The message is: {mesg}</p>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button onClick={sendMessage}>Send Message</button>
      </header>
    </div>
  );
}

export default CarControl;