import React, { useMemo, useRef, useState } from 'react';

const VoiceControl = ({ onCommand, isBusy }) => {
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState('');
  const [speechSupportError, setSpeechSupportError] = useState('');
  const recognitionRef = useRef(null);

  const SpeechRecognition = useMemo(
    () => (window.SpeechRecognition || window.webkitSpeechRecognition || null),
    []
  );

  const startListening = () => {
    if (!SpeechRecognition) {
      setSpeechSupportError('Web Speech API is not supported in this browser. Use Chrome or Edge.');
      return;
    }

    setSpeechSupportError('');
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = async (event) => {
      const command = event.results[0][0].transcript.toLowerCase();
      setLastCommand(command);
      await onCommand(command);
    };

    recognition.onerror = () => {
      setSpeechSupportError('Voice recognition failed. Please try again.');
      setIsListening(false);
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
    <div className="glass-card rounded-4 p-3 p-lg-4 h-100">
      <p className="page-section-title mb-1">Voice Control</p>
      <h4 className="mb-3">Command center</h4>
      <div className="d-flex gap-2 flex-wrap">
        <button className="btn gradient-btn text-white" onClick={startListening} disabled={isListening || isBusy}>
          {isListening ? 'Listening...' : 'Activate Voice'}
        </button>
        <button className="btn btn-outline-secondary" onClick={stopListening} disabled={!isListening}>
          Stop Voice
        </button>
      </div>
      <p className="small text-muted mt-3 mb-2">Try: “Start camera”, “Stop camera”, “Detect objects”, “Navigate”</p>
      {lastCommand && <div className="alert alert-info py-2">Last command: {lastCommand}</div>}
      {speechSupportError && <div className="alert alert-warning py-2 mb-0">{speechSupportError}</div>}
    </div>
  );
};

export default VoiceControl;
