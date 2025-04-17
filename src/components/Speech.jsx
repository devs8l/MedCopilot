import { useState, useEffect, useContext } from 'react';
import { Mic, MicOff } from 'lucide-react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { ChatContext } from '../context/ChatContext';

export default function SpeechRecognitionApp() {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition();

  const {setInputMessage,setIsSpeechActive} = useContext(ChatContext);
  
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Track when user is speaking
  useEffect(() => {
    if (!listening) {
      setIsSpeaking(false);
      return;
    }
    
    // Simple heuristic: if transcript changes, assume speaking
    const timer = setTimeout(() => setIsSpeaking(false), 1000);
    setIsSpeaking(true);
    
    return () => clearTimeout(timer);
  }, [transcript, listening]);
  
  // Handle transcript visibility
  useEffect(() => {
    if (transcript) setVisible(true);
  }, [transcript]);
  
  // Check browser support
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setError('Your browser does not support speech recognition.');
    } else if (!isMicrophoneAvailable) {
      setError('Microphone access is not available. Please check your permissions.');
    } else {
      setError(null);
    }
  }, [browserSupportsSpeechRecognition, isMicrophoneAvailable]);
  
  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      setInputMessage(transcript);
      setIsSpeechActive(false);
    } else {
      resetTranscript();
      setVisible(false);
      SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <p className="text-gray-600">
          Try using Chrome or Edge on desktop for best results.
        </p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* Transcript display */}
      <div className={`mb-8 max-w-lg w-full text-xl text-center transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}>
        {transcript || (listening ? 'Listening...' : 'Press the microphone to start')}
      </div>
      

      
      {/* Microphone button */}
      <div className="flex flex-col items-center">
        <button
          onClick={toggleListening}
          disabled={!!error}
          className={`w-16 h-16 rounded-full flex items-center justify-center relative ${
            listening ? 'bg-red-500' : 'bg-blue-500 hover:bg-blue-600'
          } transition-colors ${error ? 'opacity-50' : ''}`}
        >
          {listening ? (
            <Mic size={24} color="white" />
          ) : (
            <MicOff size={24} color="white" />
          )}
          {listening && (
            <span className="absolute inset-0 rounded-full bg-red-500 opacity-0 animate-ping"></span>
          )}
        </button>
        <p className="mt-3 text-gray-600">
          {listening ? (isSpeaking ? 'Speaking...' : 'Listening...') : 'Tap to speak'}
        </p>
      </div>
      
      {/* Animation styles */}
      <style jsx>{`
        @keyframes wave {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.8); }
        }
        .animate-wave {
          animation: wave 1s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}