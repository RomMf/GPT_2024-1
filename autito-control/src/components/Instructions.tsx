import React from 'react';
import './Instructions.css';

interface InstructionsProps {
  onClose: () => void;
}

const Instructions: React.FC<InstructionsProps> = ({ onClose }) => {
  return (
    <div className="instructions-overlay">
      <div className="instructions-content">
        <h2>Instructivo</h2>
        <p>Para controlar el autito, utiliza los siguientes controles:</p>
        <ul>
          <li><b>Joystick:</b> Usa el joystick para mover el autito hacia adelante, atrás, izquierda y derecha.</li>
          <li><b>Flechas:</b> Usa las flechas para mover el autito hacia la izquierda y derecha.</li>
          <li><b>Botón de cámara:</b> Haz clic en el botón de la cámara para encender y apagar la cámara.</li>
          <li><b>Control de velocidad:</b> Ajusta el deslizador para controlar la velocidad del autito.</li>
          <li><b>Botones LED:</b> Usa los botones para encender y apagar las luces LED del autito.</li>
        </ul>
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default Instructions;
