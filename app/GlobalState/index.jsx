'use client';
import React, { createContext, useReducer, useContext } from 'react';
import clicker from '../clicker';

const initialState = {
  count: 0,
  userName: '',
  date : '',
  email: '',
  vibration : false,
  id : 0,
  loading : false,
  click : 1,
  multiply : 1
};
function globalReducer(state, action) {
  switch (action.type) {
    case 'SET_USER_NAME':
      return { ...state, userName: action.payload };
    case 'UPDATE_COUNT':
      return { ...state, count: action.payload };
    case 'SET_USER_COUNT':
      return { ...state, count: action.payload };
    case 'SET_USER_DATE':
        return { ...state, date: action.payload };
    case 'SET_USER_EMAIL':
      return { ...state, email: action.payload };
    case 'SET_VIBRATION':
      return { ...state, vibration: action.payload };
    case 'SET_ID':
      return { ...state, id: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_CLICK':
      return { ...state, click: action.payload };
    case 'SET_MULTIPLY':
      return { ...state, multiply: action.payload };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}


const GlobalContext = createContext();


export function GlobalProvider({ children }) {
  const [state, dispatch] = useReducer(globalReducer, initialState);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalContext() {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
}
