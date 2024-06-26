import React, { useState, useEffect, useRef } from 'react';
import './CarControl.css';
import { Joystick } from 'react-joystick-component';
import Instructions from './Instructions'; // Asegúrate de que la ruta sea correcta
import { FaLightbulb } from 'react-icons/fa'; // Biblioteca react-icons para íconos

interface IJoystickUpdateEvent {
  type: string;
  x: number | null;
  y: number | null;
}

function App() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState('Conectando...');
  const [showInstructions, setShowInstructions] = useState(false);
  const [speed, setSpeed] = useState(50); // Estado para la velocidad
  const ultimoComandoEnviadoRef = useRef('');

  useEffect(() => {
    const connectWebSocket = () => {
      const webSocket = new WebSocket('ws://192.168.18.108:81');
      setWs(webSocket);

      webSocket.onopen = () => {
        console.log('Conexión WebSocket abierta');
        setConnectionStatus('Conectado');
      };

      webSocket.onerror = (error) => {
        console.log('WebSocket error: ', error);
        setConnectionStatus('Error de conexión');
      };

      webSocket.onclose = () => {
        console.log('Conexión WebSocket cerrada. Reintentando...');
        setConnectionStatus('Reconectando...');
        setTimeout(connectWebSocket, 3000); // Reintentar conexión cada 3 segundos
      };

      webSocket.onmessage = (e) => {
        console.log('Mensaje desde el servidor:', e.data);
      };
    };

    connectWebSocket();

    return () => {
      ws?.close();
    };
  }, []);

  const enviarComando = (comando: string) => {
    if (ws?.readyState === WebSocket.OPEN && comando !== ultimoComandoEnviadoRef.current) {
      const mensaje = JSON.stringify({ command: comando });
      ws.send(mensaje);
      ultimoComandoEnviadoRef.current = comando;
      console.log('Comando enviado:', mensaje);
      setConnectionStatus(`Último comando: ${comando}`);
    }
  };

  const handleMove = (direction: string) => {
    enviarComando(direction);
  };

  const handleLeftJoyMove = (event: IJoystickUpdateEvent) => {
    const { x, y } = event;

    if (x === null || y === null) return handleJoystickStop();
    let angle = Math.atan2(y, x) * (180 / Math.PI);

    if (angle < 0) {
      angle += 360;
    }
    if (angle > 90 && angle <= 270) {
      enviarComando('left');
    } else {
      enviarComando('right');
    }
  };

  const handleRightJoyMove = (event: IJoystickUpdateEvent) => {
    const { x, y } = event;

    if (x === null || y === null) return handleJoystickStop();
    let angle = Math.atan2(y, x) * (180 / Math.PI);

    if (angle < 0) {
      angle += 360;
    }
    if (angle > 0 && angle <= 180) {
      enviarComando('forward');
    } else if (angle > 180 && angle <= 360) {
      enviarComando('backward');
    }
  };

  const handleJoystickStop = () => {
    enviarComando('stop');
  };

  const handleSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSpeed = parseInt(event.target.value, 10);
    setSpeed(newSpeed);
    enviarComando(`speed:${newSpeed}`);
  };

  return (
    <div className="app-container">
      <div className="top-right-icon">
        <div className="instructions-icon" onClick={() => setShowInstructions(true)}>
          <FaLightbulb size={30} />
        </div>
      </div>
      <p className="connection-status">Estado de la conexión: {connectionStatus}</p>
      <div className="controls-container">
        <div className="arrow-buttons">
          <div className="left-joystick">
            <Joystick
              size={100}
              baseColor="rgba(0,0,0,0.5)"
              stickColor="rgba(255,255,255,0.8)"
              move={handleLeftJoyMove}
              stop={handleJoystickStop}
            />
          </div>
          <div className="right-joystick">
            <Joystick
              size={100}
              baseColor="rgba(0,0,0,0.5)"
              stickColor="rgba(255,255,255,0.8)"
              move={handleRightJoyMove}
              stop={handleJoystickStop}
            />
          </div>
        </div>
      </div>
      <div className="led-buttons">
        <button className="orange-button" onClick={() => enviarComando('led_on')}>Encender LED</button>
        <button className="orange-button" onClick={() => enviarComando('led_off')}>Apagar LED</button>
      </div>
      <div className="speed-control">
        <label htmlFor="speed-slider">Control de Velocidad:</label>
        <input
          id="speed-slider"
          type="range"
          min="0"
          max="100"
          value={speed}
          onChange={handleSpeedChange}
        />
      </div>
      {showInstructions && <Instructions onClose={() => setShowInstructions(false)} />}
    </div>
  );
}

export default App;










