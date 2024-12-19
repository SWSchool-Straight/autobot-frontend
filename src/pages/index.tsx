
import * as React from 'react';
import Chatbot from 'react-chatbot-kit'
import 'react-chatbot-kit/build/main.css'

import config from "../bot/config";
import MessageParser from "../bot/MessageParser";
import ActionProvider from "../bot/ActionProvider";

export default function DashboardPage() {
  return (
      <Chatbot
        config={config}
        messageParser={MessageParser}
        actionProvider={ActionProvider}
      />
  );
}
