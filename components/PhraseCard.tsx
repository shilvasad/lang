import React from 'react';
import { type Phrase } from '../types';
import { SpeakerWaveIcon, SnailIcon } from './Icons';

interface PhraseCardProps {
  phrase: Phrase;
}

const PhraseCard: React.FC<PhraseCardProps> = ({ phrase }) => {
  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(phrase.italiano);
      utterance.lang = 'it-IT';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Sorry, your browser doesn't support text-to-speech.");
    }
  };

  const handleSpeakSlowly = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any current speech
      const words = phrase.italiano.split(/\s+/).filter(word => word.length > 0);
      let wordIndex = 0;

      const speak = () => {
        if (wordIndex >= words.length) {
          return; // All words have been spoken
        }
        const word = words[wordIndex];
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'it-IT';
        utterance.rate = 0.7; // Slower rate for individual words
        
        utterance.onend = () => {
          wordIndex++;
          // Add a small delay between words for clarity
          setTimeout(speak, 200);
        };
        
        window.speechSynthesis.speak(utterance);
      };

      speak();
    } else {
      alert("Sorry, your browser doesn't support text-to-speech.");
    }
  };

  return (
    <div className="flex h-full flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-lg hover:border-blue-300">
      <div>
        <div className="mb-4">
          <p className="text-lg font-semibold text-slate-800">{phrase.bangla}</p>
          <p className="text-sm text-slate-500">{phrase.english}</p>
        </div>
        
        <div className="relative mb-3">
            <h2 className="text-xl font-bold text-blue-600 pr-20">{phrase.italiano}</h2>
            <div className="absolute top-0 right-0 flex items-center space-x-1">
                <button 
                    onClick={handleSpeakSlowly} 
                    className="p-1 text-slate-400 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Listen to Italian phrase slowly"
                >
                    <SnailIcon className="h-6 w-6" />
                </button>
                <button 
                    onClick={handleSpeak} 
                    className="p-1 text-slate-400 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Listen to Italian phrase"
                >
                    <SpeakerWaveIcon className="h-6 w-6" />
                </button>
            </div>
        </div>
        
        <p className="mb-4 text-blue-500 font-medium">"{phrase.pronunciation}"</p>

      </div>
      
      {phrase.note && (
        <div className="mt-auto border-t border-slate-200 pt-3">
          <p className="text-xs text-slate-500">
            <span className="font-semibold">Note:</span> {phrase.note}
          </p>
        </div>
      )}
    </div>
  );
};

export default PhraseCard;
