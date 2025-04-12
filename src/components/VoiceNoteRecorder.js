import React, { useState, useEffect, useRef } from 'react';
import { SpeechConfig, AudioConfig, SpeechRecognizer } from 'microsoft-cognitiveservices-speech-sdk';

function VoiceNoteRecorder({ onSaveNote, patientId }) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [status, setStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const recognizerRef = useRef(null);

  // Azure Speech Services configuration
  const SPEECH_KEY = '3169dff8eb2e4b899157cfcee2a68e4f';
  const SPEECH_REGION = 'eastasia';

  const startRecording = () => {
    try {
      setStatus('Initializing speech services...');
      
      // Create the speech configuration
      const speechConfig = SpeechConfig.fromSubscription(SPEECH_KEY, SPEECH_REGION);
      speechConfig.speechRecognitionLanguage = 'en-US';
      
      // Create the audio configuration using the default microphone
      const audioConfig = AudioConfig.fromDefaultMicrophoneInput();
      
      // Create the speech recognizer
      const recognizer = new SpeechRecognizer(speechConfig, audioConfig);
      recognizerRef.current = recognizer;
      
      // Start continuous recognition
      recognizer.startContinuousRecognitionAsync(
        () => {
          setIsRecording(true);
          setStatus('Recording... Speak now');
        },
        (error) => {
          console.error('Error starting speech recognition:', error);
          setStatus(`Error: ${error}`);
          setIsRecording(false);
        }
      );
      
      // Process recognition results
      recognizer.recognized = (s, e) => {
        if (e.result.reason === 1) { // ResultReason.RecognizedSpeech
          const newText = e.result.text;
          setTranscript(prev => prev + ' ' + newText);
        }
      };
      
      // Handle recognition errors
      recognizer.canceled = (s, e) => {
        console.log(`CANCELED: Reason=${e.reason}`);
        if (e.reason === 3) { // CancellationReason.Error
          console.log(`ERROR: ${e.errorCode} ${e.errorDetails}`);
          setStatus(`Error: ${e.errorDetails}`);
        }
        stopRecording();
      };
      
    } catch (error) {
      console.error('Failed to initialize speech recognition:', error);
      setStatus('Failed to start recording. Please try again.');
    }
  };

  const stopRecording = () => {
    if (recognizerRef.current) {
      recognizerRef.current.stopContinuousRecognitionAsync(
        () => {
          setIsRecording(false);
          setStatus('Recording finished');
        },
        (error) => {
          console.error('Error stopping speech recognition:', error);
          setStatus(`Error stopping: ${error}`);
          setIsRecording(false);
        }
      );
    }
  };

  const handleSaveNote = async () => {
    if (!transcript.trim()) {
      setStatus('Cannot save empty note');
      return;
    }
    
    setIsSaving(true);
    setStatus('Saving note...');
    
    try {
      // Create note object
      const note = {
        content: transcript.trim(),
        timestamp: new Date().toISOString(),
        patientId: patientId,
        type: 'voice'
      };
      
      // Pass the note to parent component
      onSaveNote(note);
      
      // Reset transcript
      setTranscript('');
      setStatus('Note saved successfully');
    } catch (error) {
      console.error('Error saving note:', error);
      setStatus('Failed to save note. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const clearTranscript = () => {
    setTranscript('');
    setStatus('Transcript cleared');
  };

  // Clean up recognizer on component unmount
  useEffect(() => {
    return () => {
      if (recognizerRef.current) {
        recognizerRef.current.close();
      }
    };
  }, []);

  return (
    <div className="bg-white shadow rounded-lg p-5">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Voice Notes</h3>
      
      <div className="space-y-4">
        {/* Status display */}
        {status && (
          <div className="text-sm text-gray-600">
            {status}
          </div>
        )}
        
        {/* Transcript display */}
        <div className="border rounded-md p-3 min-h-[150px] bg-gray-50">
          {transcript ? (
            <p className="text-gray-800">{transcript}</p>
          ) : (
            <p className="text-gray-400 italic">Transcript will appear here...</p>
          )}
        </div>
        
        {/* Recording controls */}
        <div className="flex flex-wrap gap-2">
          {!isRecording ? (
            <button
              onClick={startRecording}
              disabled={isSaving}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
              </svg>
              Start Recording
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
              </svg>
              Stop Recording
            </button>
          )}
          
          <button
            onClick={clearTranscript}
            disabled={!transcript || isRecording || isSaving}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 disabled:opacity-50"
          >
            Clear
          </button>
          
          <button
            onClick={handleSaveNote}
            disabled={!transcript || isRecording || isSaving}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 ml-auto"
          >
            {isSaving ? 'Saving...' : 'Save Note'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default VoiceNoteRecorder; 