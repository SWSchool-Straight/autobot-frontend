import React, { useState } from 'react';
import Chatbot from 'react-chatbot-kit'
import 'react-chatbot-kit/build/main.css'
import './App.css'
import './styles/chatbot-custom.css'

import config from "./bot/config";
import MessageParser from "./bot/MessageParser";
import ActionProvider from "./bot/ActionProvider";

function App() {
  const [message, setMessage] = useState('');

  return (
    <div className="App">
      <h1>Chatbot</h1>
      <Chatbot
        config={config}
        messageParser={MessageParser}
        actionProvider={ActionProvider}
      />
    </div>
    
  );
}

export default App;
