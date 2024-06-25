import React, { useState, useEffect } from 'react';
import './CarControl.css';
import { Joystick } from 'react-joystick-component'; 

interface IJoystickUpdateEvent { 
  type: string; 
  x: number | null; 
  y: number | null; 
}


function App() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState('Conectando...');

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

  let ultimoComandoEnviado = '';


  const enviarComando = (comando: string) => {
    if (ws?.readyState === WebSocket.OPEN && comando !== ultimoComandoEnviado) {
      const mensaje = JSON.stringify({ command: comando });
      ws.send(mensaje);
      ultimoComandoEnviado = comando;
      console.log('Comando enviado:', mensaje);
      setConnectionStatus(`Último comando: ${comando}`);
    }
  };

  const handleMove = (direction: string) => {
    enviarComando(direction);
  };

  const handleJoystickMove = (event: IJoystickUpdateEvent) => {
    const { x, y } = event;
  
    // Paso 1: Calcular el ángulo en grados
    if(x === null || y === null) return handleJoystickStop();
    let angle = Math.atan2(y, x) * (180 / Math.PI);
  
    // Paso 2: Normalizar el ángulo para que esté en el rango de 0 a 360 grados
    if (angle < 0) {
      angle += 360;
    }
  
    // Paso 3: Determinar el cuadrante y enviar el comando correspondiente
    if ((angle >= 0 && angle <= 45) || (angle > 315 && angle <= 360)) {
      enviarComando('right');
    } else if (angle > 45 && angle <= 135) {
      enviarComando('forward');
    } else if (angle > 135 && angle <= 225) {
      enviarComando('left');
    } else if (angle > 225 && angle <= 315) {
      enviarComando('backward');
    }
  };
  const handleJoystickStop = () => { 
    enviarComando('stop'); 
  }; 

  return (
    <div className="app-container">
      <p className="connection-status">Estado de la conexión: {connectionStatus}</p>
      <div className="controls-container">
        <div className="arrow-buttons">
        <Joystick 
            size={100} 
            baseColor="rgba(0,0,0,0.5)" 
            stickColor="rgba(255,255,255,0.8)" 
            move={handleJoystickMove} 
            stop={handleJoystickStop} 
          /> 
        </div>
        
      </div>
      <div className="led-buttons">
        <button onClick={() => enviarComando('led_on')}>Encender LED</button>
        <button onClick={() => enviarComando('led_off')}>Apagar LED</button>
      </div>
    </div>
  );
}

export default App;







