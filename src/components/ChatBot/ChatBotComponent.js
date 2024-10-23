import React, { Component, createRef } from 'react';
import axios from 'axios';
import './ChatBotComponent.scss';

class ChatBotComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            input: '',
            isChatOpen: false,
        };
        this.messagesEndRef = createRef();
    }

    toggleChat = () => {
        this.setState(prevState => ({ isChatOpen: !prevState.isChatOpen }));
    };

    handleSendMessage = async () => {
        const { input, messages } = this.state;
        if (input.trim() === '') return;

        const userMessage = { sender: 'user', text: input };
        this.setState({ messages: [...messages, userMessage], input: '' }, this.scrollToBottom);

        try {
            const response = await axios.post('http://localhost:8080/webhook', {
                queryInput: {
                    text: {
                        text: input,
                        languageCode: 'vi',
                    },
                },
            });
            const botMessage = { sender: 'bot', text: response.data.fulfillmentText };
            this.setState(prevState => ({
                messages: [...prevState.messages, userMessage, botMessage],
            }), this.scrollToBottom);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    scrollToBottom = () => {
        if (this.messagesEndRef.current) {
            this.messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    handleInputChange = (event) => {
        this.setState({ input: event.target.value });
    };

    handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            this.handleSendMessage();
        }
    };

    closeChat = () => {
        this.setState({ isChatOpen: false });
    };


    render() {
        const { messages, input, isChatOpen } = this.state;

        return (
            <div className="chat-widget">
                {!isChatOpen &&
                    <div className="chat-icon" onClick={this.toggleChat}>
                        🗨️
                    </div>
                }
                {isChatOpen && (
                    <div className="chat-container">
                        <div className="chat-header">
                            <span className="chat-title">Chatbot</span>
                            <button className="close-button" onClick={this.closeChat}>✖</button>
                        </div>
                        <div className="messages">
                            {messages.map((msg, index) => (
                                <div key={index} className={`message ${msg.sender}`}>
                                    {msg.text}
                                </div>
                            ))}
                            <div ref={this.messagesEndRef} />
                        </div>
                        <input
                            type="text"
                            value={input}
                            onChange={this.handleInputChange}
                            onKeyPress={this.handleKeyPress}
                            placeholder="Type a message..."
                        />
                        <button onClick={this.handleSendMessage}>Send</button>
                    </div>
                )}
            </div>
        );
    }
}

export default ChatBotComponent;
