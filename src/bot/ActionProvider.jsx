import React from 'react';

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const handleServerResponse = (message) => {
    const botMessage = createChatBotMessage(message);
    
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  const handleError = (errorMessage) => {
    const botMessage = createChatBotMessage(errorMessage, {
      widget: 'errorMessage',
    });
    
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: {
            handleServerResponse,
            handleError,
          },
        });
      })}
    </div>
  );
};

export default ActionProvider;