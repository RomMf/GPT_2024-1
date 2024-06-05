import React, { useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { Joystick } from 'react-joystick-component';
import Instructions from './Instructions';
import './CarControl.css';

interface IJoystickUpdateEvent {
  type: string;
  x: number | null;
  y: number | null;
}

const CarControl: React.FC = () => {
  const { sendMessage, readyState } = useWebSocket('ws://TU_IP_DEL_ARDUINO:81', {
    onOpen: () => console.log('Connected to WebSocket'),
    onClose: () => console.log('Disconnected from WebSocket'),
    onError: (event) => console.error(event),
    shouldReconnect: () => true,
  });

  const [speed, setSpeed] = useState(0.5);
  const [cameraOn, setCameraOn] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const handleCommand = (command: string) => {
    sendMessage(command);
  };

  const handleJoystickMove = (event: IJoystickUpdateEvent) => {
    const { x, y } = event;
    if (y && y > 0) {
      handleCommand('forward');
    } else if (y && y < 0) {
      handleCommand('backward');
    }
    if (x && x > 0) {
      handleCommand('right');
    } else if (x && x < 0) {
      handleCommand('left');
    }
  };

  const handleJoystickStop = () => {
    handleCommand('stop');
  };

  const toggleCamera = () => {
    setCameraOn(!cameraOn);
    handleCommand(cameraOn ? 'camera_off' : 'camera_on');
  };

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

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
          <button onClick={() => handleCommand('led_on')}>LED Encendido</button>
          <button onClick={() => handleCommand('led_off')}>LED Apagado</button>
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
          <button onClick={() => handleCommand('left')}>&larr;</button>
          <button onClick={() => handleCommand('right')}>&rarr;</button>
        </div>
      </div>
      <p>WebSocket Status: {connectionStatus}</p>
    </div>
  );
};

export default CarControl;





