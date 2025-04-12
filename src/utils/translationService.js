import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const TRANSLATOR_KEY = process.env.REACT_APP_TRANSLATOR_KEY || "1SIwPVGaWtL1b2s0EzfajBiExkl3n8niWLCGOH02RStwHpqB8DMJJQQJ99BDACYeBjFXJ3w3AAAbACOGRks6";
const ENDPOINT = "https://api.cognitive.microsofttranslator.com";
const LOCATION = "eastus";

// List of supported languages by the Azure Translator
const supportedLanguages = [
  'en', // English
  'hi', // Hindi
  'ta', // Tamil
  'te', // Telugu
  'kn', // Kannada
  'ml', // Malayalam
  'mr', // Marathi
  'gu', // Gujarati
  'bn', // Bengali
  'pa', // Punjabi
  'ur'  // Urdu
];

export const translateText = async (text, targetLanguage = 'hi') => {
  try {
    // Check if the target language is supported
    if (!supportedLanguages.includes(targetLanguage)) {
      console.warn(`Language ${targetLanguage} is not supported. Falling back to Hindi.`);
      targetLanguage = 'hi';
    }

    const response = await axios({
      baseURL: ENDPOINT,
      url: '/translate',
      method: 'post',
      headers: {
        'Ocp-Apim-Subscription-Key': TRANSLATOR_KEY,
        'Ocp-Apim-Subscription-Region': LOCATION,
        'Content-type': 'application/json',
        'X-ClientTraceId': uuidv4().toString()
      },
      params: {
        'api-version': '3.0',
        'from': 'en',
        'to': targetLanguage
      },
      data: [{
        'text': text
      }],
      responseType: 'json'
    });

    return response.data[0].translations[0].text;
  } catch (error) {
    console.error('Translation error:', error);
    // Return original text with error indicator if translation fails
    return `${text} (Translation unavailable)`;
  }
};

// Function to translate multiple texts at once
export const translateMultipleTexts = async (texts, targetLanguage = 'hi') => {
  try {
    // Check if the target language is supported
    if (!supportedLanguages.includes(targetLanguage)) {
      console.warn(`Language ${targetLanguage} is not supported. Falling back to Hindi.`);
      targetLanguage = 'hi';
    }

    const response = await axios({
      baseURL: ENDPOINT,
      url: '/translate',
      method: 'post',
      headers: {
        'Ocp-Apim-Subscription-Key': TRANSLATOR_KEY,
        'Ocp-Apim-Subscription-Region': LOCATION,
        'Content-type': 'application/json',
        'X-ClientTraceId': uuidv4().toString()
      },
      params: {
        'api-version': '3.0',
        'from': 'en',
        'to': targetLanguage
      },
      data: texts.map(text => ({ 'text': text })),
      responseType: 'json'
    });

    return response.data.map(item => item.translations[0].text);
  } catch (error) {
    console.error('Translation error:', error);
    // Return original texts with error indicators if translation fails
    return texts.map(text => `${text} (Translation unavailable)`);
  }
};

// Function to detect the language of text
export const detectLanguage = async (text) => {
  try {
    const response = await axios({
      baseURL: ENDPOINT,
      url: '/detect',
      method: 'post',
      headers: {
        'Ocp-Apim-Subscription-Key': TRANSLATOR_KEY,
        'Ocp-Apim-Subscription-Region': LOCATION,
        'Content-type': 'application/json',
        'X-ClientTraceId': uuidv4().toString()
      },
      data: [{
        'text': text
      }],
      responseType: 'json'
    });

    return response.data[0].language;
  } catch (error) {
    console.error('Language detection error:', error);
    return 'en'; // Default to English if detection fails
  }
}; 