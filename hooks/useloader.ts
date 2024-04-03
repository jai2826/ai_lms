import { create } from 'zustand';

type LoaderStore = {
  isLoading: Boolean;
  value: number;
  setValue: (value: number) => void;
  setIsloading: (value: boolean) => void;
};

export const useLoader = create<LoaderStore>((set) => ({
  isLoading: false,
  value: 0,
  setValue: (newValue) => set({ isLoading: true, value: newValue }),
  setIsloading: (newState) => set({ isLoading: newState }),
}));
