import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type GoalType = 'grow_business' | 'build_brand' | 'stay_connected' | null;

interface OnboardingState {
  currentStep: number;
  goal: GoalType;
  profile: {
    linkedinUrl: string;
    websiteUrl: string;
    summary: string;
  };
  voice: {
    length: number;
    tone: number;
    emoji: number;
  };
  knowledge: {
    files: string[];
    productName: string;
    websiteUrl: string;
  };
  connections: string[];
  trial: {
    subscribed: boolean;
    inviteCode?: string;
  };
  completed: boolean;
  
  // Actions
  setStep: (step: number) => void;
  setGoal: (goal: GoalType) => void;
  setProfile: (profile: Partial<OnboardingState['profile']>) => void;
  setVoice: (voice: Partial<OnboardingState['voice']>) => void;
  setKnowledge: (knowledge: Partial<OnboardingState['knowledge']>) => void;
  addConnection: (platform: string) => void;
  setTrial: (trial: Partial<OnboardingState['trial']>) => void;
  completeOnboarding: () => void;
  reset: () => void;
}

const initialState = {
  currentStep: 1,
  goal: null as GoalType,
  profile: {
    linkedinUrl: '',
    websiteUrl: '',
    summary: '',
  },
  voice: {
    length: 50,
    tone: 50,
    emoji: 33,
  },
  knowledge: {
    files: [],
    productName: '',
    websiteUrl: '',
  },
  connections: [],
  trial: {
    subscribed: false,
  },
  completed: false,
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      ...initialState,
      
      setStep: (step) => set({ currentStep: step }),
      
      setGoal: (goal) => set({ goal }),
      
      setProfile: (profile) => set((state) => ({
        profile: { ...state.profile, ...profile }
      })),
      
      setVoice: (voice) => set((state) => ({
        voice: { ...state.voice, ...voice }
      })),
      
      setKnowledge: (knowledge) => set((state) => ({
        knowledge: { ...state.knowledge, ...knowledge }
      })),
      
      addConnection: (platform) => set((state) => ({
        connections: state.connections.includes(platform) 
          ? state.connections 
          : [...state.connections, platform]
      })),
      
      setTrial: (trial) => set((state) => ({
        trial: { ...state.trial, ...trial }
      })),
      
      completeOnboarding: () => set({ completed: true }),
      
      reset: () => set(initialState),
    }),
    {
      name: 'knudge-onboarding',
    }
  )
);
