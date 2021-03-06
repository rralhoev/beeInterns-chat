import React, { useState, useEffect } from 'react';
import { Context } from './Context';

import weatherApi from './api/WeatherApi';
import ChatApi from './api/ChatApi';

import { ChatInput, ChatButton, ChatMessages } from './components/index';

function App() {
  const [chatApi] = useState([ChatApi()]);
  const [inputValue, setInputValue] = useState('');
  const [messageList, messageListSet] = useState([{ text: 'Введите команду /start, для начала общения', id: 1, isUser: false }]);
  const [isInputFocused, isInputFocusedSet] = useState(false);
  
  useEffect(() => {
    const chatArea = document.querySelector('.message__list');
    chatArea.scrollTop = 99999999;
  }, []);

  const sendCommand = command => {
    let response;

    if (/^\/weather: [A-Za-z\s]+$/.test(command)) {
      let city = command.split(': ')[1];
      weatherApi(city).then(data => {
        response = data ? `Погода в "${city}": ${data.weather[0].main} (${data.weather[0].description})` : `Города ${city} не существует`;
        messageListSet([
          { 
            text: response,
            id: [messageList.length + 2],
            isUser: false,
            img: data ? data.weather[0].main : false },
          { text: command, id: [messageList.length + 1], isUser: true },
          ...messageList
        ]);
      });
    } else {
      response = chatApi[0](command);
      messageListSet([
        { text: response, id: [messageList.length + 2], isUser: false },
        { text: command, id: [messageList.length + 1], isUser: true },
        ...messageList
      ]);
    }
  };
  
  const whenButtonClick = (e) => {
    e.preventDefault();
    isInputFocusedSet(false);
    if (inputValue !== '')
      sendCommand(inputValue);
    setInputValue('');
  }

  return (
    <div className="App">
      <h1>Чат-бот</h1>
      <div className="chat">
        <div className="message__list">
          <ChatMessages
            isInputFocused={isInputFocused}
            messageList={messageList}
          />
        </div>
        <form className="chat__input">
          <Context.Provider value={{
            whenButtonClick,
            inputValue,
            isInputFocusedSet,
            setInputValue
          }}>
            <ChatInput />
            <ChatButton />
          </Context.Provider>
        </form>
      </div>
    </div>
  );
}

export default App;
