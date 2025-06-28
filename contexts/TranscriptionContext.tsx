import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TranscriptionContextType {
  transcriptionsEnabled: boolean;
  toggleTranscriptions: () => Promise<void>;
  loading: boolean;
}

const TranscriptionContext = createContext<TranscriptionContextType | undefined>(undefined);

const STORAGE_KEY = '@echo_transcription_enabled';

export function TranscriptionProvider({ children }: { children: ReactNode }) {
  const [transcriptionsEnabled, setTranscriptionsEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  // Load transcription setting from storage on mount
  useEffect(() => {
    loadTranscriptionSetting();
  }, []);

  const loadTranscriptionSetting = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        setTranscriptionsEnabled(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading transcription setting:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTranscriptions = async () => {
    try {
      const newValue = !transcriptionsEnabled;
      setTranscriptionsEnabled(newValue);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newValue));
    } catch (error) {
      console.error('Error saving transcription setting:', error);
    }
  };

  return (
    <TranscriptionContext.Provider value={{
      transcriptionsEnabled,
      toggleTranscriptions,
      loading,
    }}>
      {children}
    </TranscriptionContext.Provider>
  );
}

export function useTranscription() {
  const context = useContext(TranscriptionContext);
  if (context === undefined) {
    throw new Error('useTranscription must be used within a TranscriptionProvider');
  }
  return context;
}