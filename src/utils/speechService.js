// Azure Speech Service Configuration
const SPEECH_KEY = process.env.REACT_APP_AZURE_SPEECH_KEY || '3169dff8eb2e4b899157cfcee2a68e4f';
const SPEECH_REGION = process.env.REACT_APP_AZURE_SPEECH_REGION || 'eastasia';

// Initialize Speech SDK
const initializeSpeechSDK = () => {
  if (!window.SpeechSDK) {
    console.error('Speech SDK is not loaded. Please check if the script is included in index.html');
    return false;
  }
  return true;
};

// Text-to-Speech functionality
export const textToSpeech = async (text) => {
  try {
    if (!initializeSpeechSDK()) {
      throw new Error('Speech SDK not initialized');
    }

    // Create and configure the SpeechSynthesizer
    const speechConfig = new window.SpeechSDK.SpeechConfig(SPEECH_KEY, SPEECH_REGION);
    const synthesizer = new window.SpeechSDK.SpeechSynthesizer(speechConfig);

    // Configure voice (optional)
    speechConfig.speechSynthesisVoiceName = 'en-US-JennyNeural';

    return new Promise((resolve, reject) => {
      synthesizer.speakTextAsync(
        text,
        result => {
          if (result.reason === window.SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
            console.log('Speech synthesis completed');
            resolve(true);
          } else {
            console.error('Speech synthesis failed:', result.errorDetails);
            reject(new Error(result.errorDetails));
          }
          synthesizer.close();
        },
        error => {
          console.error('Speech synthesis error:', error);
          synthesizer.close();
          reject(error);
        }
      );
    });
  } catch (error) {
    console.error('Speech synthesis error:', error);
    throw error;
  }
};

// Speech-to-Text functionality
export const speechToText = async (onInterimResult, onFinalResult) => {
  try {
    if (!initializeSpeechSDK()) {
      throw new Error('Speech SDK not initialized');
    }

    // Create the speech configuration
    const speechConfig = new window.SpeechSDK.SpeechConfig(SPEECH_KEY, SPEECH_REGION);
    speechConfig.speechRecognitionLanguage = 'en-US';

    // Create the audio configuration
    const audioConfig = window.SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
    
    // Create the speech recognizer
    const recognizer = new window.SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

    // Handle continuous recognition
    recognizer.recognized = (s, e) => {
      if (e.result.reason === window.SpeechSDK.ResultReason.RecognizedSpeech) {
        const text = e.result.text.trim();
        if (text) {
          onFinalResult(text);
        }
      }
    };

    recognizer.recognizing = (s, e) => {
      if (e.result.reason === window.SpeechSDK.ResultReason.RecognizingSpeech) {
        const text = e.result.text.trim();
        if (text) {
          onInterimResult(text);
        }
      }
    };

    // Start continuous recognition
    await recognizer.startContinuousRecognitionAsync();

    // Return stop function
    return async () => {
      try {
        await recognizer.stopContinuousRecognitionAsync();
        recognizer.close();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
    };
  } catch (error) {
    console.error('Speech recognition error:', error);
    throw error;
  }
};

// Check if speech synthesis is available
export const isSpeechAvailable = () => {
  return window.SpeechSDK !== undefined;
}; 