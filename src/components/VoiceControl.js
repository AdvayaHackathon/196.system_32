import React, { useState, useEffect } from 'react';
import * as speechsdk from 'microsoft-cognitiveservices-speech-sdk';

const SPEECH_KEY = '3169dff8eb2e4b899157cfcee2a68e4f';
const SPEECH_REGION = 'eastasia';

const VoiceControl = ({ onTranscription, onSpeechEnd }) => {
  const [isListening, setIsListening] = useState(false);
  const [speechConfig, setSpeechConfig] = useState(null);
  const [synthesizer, setSynthesizer] = useState(null);
  const [recognizer, setRecognizer] = useState(null);

  useEffect(() => {
    // Initialize speech config
    const config = speechsdk.SpeechConfig.fromSubscription(SPEECH_KEY, SPEECH_REGION);
    config.speechRecognitionLanguage = 'en-US';
    setSpeechConfig(config);

    // Initialize speech synthesizer
    const synth = new speechsdk.SpeechSynthesizer(config);
    setSynthesizer(synth);

    // Initialize speech recognizer
    const recog = new speechsdk.SpeechRecognizer(config);
    setRecognizer(recog);

    return () => {
      if (synth) synth.close();
      if (recog) recog.close();
    };
  }, []);

  const startListening = () => {
    if (recognizer) {
      setIsListening(true);
      recognizer.recognizeOnceAsync(
        (result) => {
          if (result.text) {
            onTranscription(result.text);
          }
          setIsListening(false);
          if (onSpeechEnd) onSpeechEnd();
        },
        (error) => {
          console.error('Speech recognition error:', error);
          setIsListening(false);
          if (onSpeechEnd) onSpeechEnd();
        }
      );
    }
  };

  const speak = async (text) => {
    if (synthesizer) {
      try {
        await synthesizer.speakTextAsync(
          text,
          (result) => {
            if (result.errorDetails) {
              console.error('Speech synthesis error:', result.errorDetails);
            }
          },
          (error) => {
            console.error('Speech synthesis error:', error);
          }
        );
      } catch (error) {
        console.error('Speech synthesis error:', error);
      }
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={startListening}
        className={`px-4 py-2 rounded-full ${
          isListening
            ? 'bg-red-500 text-white'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        {isListening ? 'Listening...' : 'Start Voice Input'}
      </button>
      <button
        onClick={() => speak('How can I help you today?')}
        className="px-4 py-2 rounded-full bg-green-500 hover:bg-green-600 text-white"
      >
        Test Speech
      </button>
    </div>
  );
};

export default VoiceControl; 