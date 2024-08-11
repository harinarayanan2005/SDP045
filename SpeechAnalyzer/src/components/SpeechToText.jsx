// SpeechToText.jsx
import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import useClipboard from 'react-use-clipboard';
import './SpeechToText.css'; // Ensure this CSS file exists for styling

const SpeechToText = () => {
  const [textToCopy, setTextToCopy] = useState('');
  const [isCopied, setCopied] = useClipboard(textToCopy, { successDuration: 1000 });

  const { transcript, listening, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setTextToCopy(transcript);
    }
  }, [transcript]);

  const startListening = () => SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
  const stopListening = () => SpeechRecognition.stopListening();

  if (!browserSupportsSpeechRecognition) {
    return <p>Browser does not support speech recognition.</p>;
  }

  return (
    <div className="speech-to-text-container">
      <h2 className="title">TalkTrack</h2>
      <div className="main-content">
        {transcript || "Click 'Start Listening' and speak to convert speech to text."}
      </div>

      <div className="btn-style">
        <button onClick={setCopied} disabled={!transcript}>
          {isCopied ? 'Copied!' : 'Copy to Clipboard'}
        </button>
        <button onClick={startListening} disabled={listening}>
          {listening ? 'Listening...' : 'Start Listening'}
        </button>
        <button onClick={stopListening} disabled={!listening}>
          Stop Listening
        </button>
      </div>
    </div>
  );
};

export default SpeechToText;
