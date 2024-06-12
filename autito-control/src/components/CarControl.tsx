import React, { useState, useEffect } from 'react';
import './CarControl.css';

function App() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState('Conectando...');

  useEffect(() => {
    const connectWebSocket = () => {
      const webSocket = new WebSocket('ws://192.168.0.21:81');
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

  

  return (
    <div className="app-container">
      <p className="connection-status">Estado de la conexión: {connectionStatus}</p>
      <div className="controls-container">
        <div className="arrow-buttons">
          <button onClick={() => handleMove('backward')} className="arrow-button">▲</button>
          <div className="horizontal-arrows">
            <button onClick={() => handleMove('left')} className="arrow-button">◀</button>
            <button onClick={() => handleMove('right')} className="arrow-button">▶</button>
          </div>
          <button onClick={() => handleMove('forward')} className="arrow-button">▼</button>
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







