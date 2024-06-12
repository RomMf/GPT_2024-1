import React, { useEffect, useState } from 'react';
import { Joystick } from 'react-joystick-component';
import Instructions from './Instructions';
import './CarControl.css';
import EMQXConnection from '../services/EMQX_conecction';
import mqtt from 'mqtt';

interface IJoystickUpdateEvent {
  type: string;
  x: number | null;
  y: number | null;
}


const topic = 'autito/#';

const CarControl: React.FC = () => {
  const brokerUrl = 'ws://34.121.97.129:8083/mqtt';
  const options = {
    clean: true,
    clientId: "control" + Math.random().toString(16).substring(2, 8),
    username: 'autito_app',
    password: 'autito_app',
    protocolVersion: 5,
  };

  const [client, setClient] = useState<mqtt.MqttClient | null>(null);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState('disconnected');
  const [speed, setSpeed] = useState(0.5);
  const [cameraOn, setCameraOn] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    const client = mqtt.connect(brokerUrl, options);
    setClient(client);
  }, []);

  useEffect(() => {
    if (client) {
      client.on('connect', () => {
        console.log('connected');
        setStatus('connected');
        client.subscribe(topic);
      });

      client.on('message', (topic, message) => {
        console.log('Received message:', message.toString());
      });

      client.on('error', (err) => {
        console.log('Connection error:', err);
        setStatus('disconnected');
      });

      client.on('offline', () => {
        console.log('offline');
        setStatus('disconnected');
      });

      client.on('reconnect', () => {
        console.log('reconnecting...');
        setStatus('connecting');
      });
    }
  }, [client]);

  useEffect(() => {
    if (client && client.connected && message) {
      client.publish(topic, message, (error) => {
        if (error) {
          console.log("Publish error: ", error);
        } else {
          console.log("Published message: ", message);
        }
      });
    }
  }, [client, message]);


  const handleJoystickMove = (event: IJoystickUpdateEvent) => {
    const { x, y } = event;
    if (y && y > 0) {
      setMessage('forward');
    } else if (y && y < 0) {
      setMessage('backward');
    }
    if (x && x > 0) {
      setMessage('right');
    } else if (x && x < 0) {
      setMessage('left');
    }
  };

  const handleJoystickStop = () => {
    setMessage('stop');
  };

  const toggleCamera = () => {
    setCameraOn(!cameraOn);
    setMessage(cameraOn ? 'camera_off' : 'camera_on');
  };


  return (
    <div className="control-container">
      {showInstructions && <Instructions onClose={() => setShowInstructions(false)} />}
      <header className="header">
        <button className="back-button">&lt;</button>
        <h1>Autito Eddison 2.0</h1>
        <button className="light-button" onClick={() => setShowInstructions(true)}>💡</button>
      </header>
      <div className="content">
        {cameraOn && (
          <div className="camera-feed">
            <img src="http://TU_IP_DEL_ARDUINO:81/stream" alt="Camera Feed" />
          </div>
        )}
        <div className="speed-control">
          <label>Velocidad</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
          />
          <span>{speed.toFixed(2)}</span>
        </div>
        <div className="buttons">
          <button className="camera-button" onClick={toggleCamera}>
            {cameraOn ? 'Apagar Cámara' : 'Encender Cámara'}
          </button>
          <button onClick={() => setMessage('led_on')}>LED Encendido</button>
          <button onClick={() => setMessage('led_off')}>LED Apagado</button>
        </div>
      </div>
      <div className="control-panel">
        <div className="joystick-container">
          <Joystick
            size={100}
            baseColor="rgba(0,0,0,0.5)"
            stickColor="rgba(255,255,255,0.8)"
            move={handleJoystickMove}
            stop={handleJoystickStop}
          />
        </div>
        <div className="direction-buttons">
          <button onClick={() => setMessage('left')}>&larr;</button>
          <button onClick={() => setMessage('right')}>&rarr;</button>
        </div>
      </div>
      <p>WebSocket Status: {status}</p>
    </div>
  );
};

export default CarControl;





