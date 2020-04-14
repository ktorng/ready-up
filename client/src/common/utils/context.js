import { createContext, useContext } from 'react';

export const GameContext = createContext(null);
export const MeContext = createContext(null);

export const useGameContext = () => useContext(GameContext);
export const useMeContext = () => useContext(MeContext);
