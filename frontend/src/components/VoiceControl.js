import React, { useRef, useState } from 'react';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const VoiceControl = ({ onCommand }) => {
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState('');
  const recognitionRef = useRef(null);

  const startListening = () => {
    if (!SpeechRecognition) {
      alert('Web Speech API is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript.toLowerCase();
      setLastCommand(command);
      onCommand(command);
    };

    recognition.onend = () => setIsListening(false);
    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header">Voice Command Panel</div>
      <div className="card-body">
        <button className="btn btn-primary me-2" onClick={startListening} disabled={isListening}>Activate Voice</button>
        <button className="btn btn-outline-secondary" onClick={stopListening}>Stop Voice</button>
        <p className="small text-muted mt-3 mb-0">Try: “Start camera”, “Stop camera”, “Detect objects”, “Navigate”</p>
        {lastCommand && <div className="alert alert-info mt-3 py-2">Last command: {lastCommand}</div>}
      </div>
    </div>
  );
};

export default VoiceControl;
