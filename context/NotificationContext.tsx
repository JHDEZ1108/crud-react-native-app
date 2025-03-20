import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NotificationContextType {
  message: string;
  visible: boolean;
  showMessage: (message: string) => void;
  hideMessage: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);

  const showMessage = (newMessage: string) => {
    setMessage(newMessage);
    setVisible(true);
    setTimeout(() => {
      setVisible(false);
    }, 3000);
  };

  const hideMessage = () => {
    setVisible(false);
  };

  return (
    <NotificationContext.Provider value={{ message, visible, showMessage, hideMessage }}>
      {children}
    </NotificationContext.Provider>
  );
};
