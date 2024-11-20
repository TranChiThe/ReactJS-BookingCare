import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import axios from '../../axios';
import * as actions from '../../store/actions';
import './ChatBotComponent.scss';

class ChatBotComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            input: '',
            isChatOpen: false,
            isLoading: false,
            hasStarted: false,
        };
        this.messagesEndRef = createRef();
    }

    componentDidMount() {
        // this.props.loadMessages();
    }


    toggleChat = () => {
        this.setState(prevState => ({
            isChatOpen: !prevState.isChatOpen
        }), () => {
            if (this.state.isChatOpen) {
                this.scrollToBottom();
            }
        });
    };

    handleStartChat = () => {
        this.setState({ hasStarted: true }, () => {
            this.scrollToBottom();
        });
    };

    handleSendMessage = async () => {
        const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        const timeOptions = { hour: '2-digit', minute: '2-digit' };
        const date = new Date();
        const formattedTime = date.toLocaleTimeString('en-US', timeOptions);

        const { input } = this.state;

        // Loại bỏ các dòng trống
        const cleanedInput = input
            .split('\n')
            .filter(line => line.trim() !== '')
            .join('\n');
        if (cleanedInput.trim() === '') return;

        const userMessage = {
            sender: 'user',
            text: cleanedInput,
            timestamp: formattedTime
        };
        this.props.addMessage(userMessage);
        this.setState({ input: '', isLoading: true }, () => {
            this.scrollToBottom();
        });

        setTimeout(async () => {
            try {
                const response = await axios.post('http://localhost:8080/webhook', {
                    query: input,
                });

                const botMessage = {
                    sender: 'bot',
                    text: response.fulfillmentText || 'Xin lỗi, tôi không hiểu yêu cầu của bạn.',
                    timestamp: formattedTime
                };
                this.props.addMessage(botMessage);
                this.scrollToBottom();
            } catch (error) {
                const errorMessage = {
                    sender: 'bot',
                    text: 'Đã xảy ra lỗi trong khi xử lý yêu cầu. Vui lòng thử lại.',
                    timestamp: formattedTime,
                };
                this.props.addMessage(errorMessage);
                this.scrollToBottom();
                console.error('Error sending message:', error);
            } finally {
                this.setState({ isLoading: false });
            }
        }, 200);
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

    clearMessages = () => {
        this.props.clearMessages();
    };

    render() {
        const { input, isChatOpen, isLoading, hasStarted } = this.state;
        const { messages = [] } = this.props;
        return (
            <div className="chat-widget">
                {!isChatOpen &&
                    <div className="chat-icon" onClick={this.toggleChat}>
                    </div>
                }
                {isChatOpen && (
                    <div className="chat-container">
                        <div className="chat-header">
                            <div className="header-top">
                                <div className='chat-logo'></div>
                                <span className="chat-title">HEALTHCARE-CSKH</span>
                                <button className="close-button" onClick={this.closeChat}>✖</button>
                            </div>
                            <div className="header-bottom">
                                <button className="clear-button" onClick={this.clearMessages}>Trò chuyện mới</button>
                            </div>
                        </div>

                        {!hasStarted ? (
                            <div className="start-chat">
                                <button className="start-button" onClick={this.handleStartChat}>
                                    Bắt đầu trò chuyện
                                </button>
                            </div>
                        ) : (
                            <div className="messages">
                                {/* {messages.map((msg, index) => (
                                    msg && msg.sender ? (
                                        <div key={index} className={`message ${msg.sender}`}>
                                            {msg.text.split('\n').map((line, i) => (
                                                <span key={i}>
                                                    {line}
                                                    <br />
                                                </span>
                                            ))}
                                            <div className="message-time">{msg.timestamp}</div>
                                        </div>
                                    ) : null
                                ))} */}
                                {messages.map((msg, index) => (
                                    msg && msg.sender ? (
                                        <div key={index} className={`message ${msg.sender}`}>
                                            {typeof msg.text === 'string' && msg.text.split('\n').map((line, i) => (
                                                <span key={i}>
                                                    {line}
                                                </span>
                                            ))}
                                        </div>
                                    ) : null
                                ))}
                                {isLoading && (
                                    <div className="loading-indicator">
                                        <div className="dot"></div>
                                        <div className="dot"></div>
                                        <div className="dot"></div>
                                    </div>
                                )}
                                <div ref={this.messagesEndRef} />
                            </div>

                        )}
                        {hasStarted && (
                            <div className="input-container">
                                <textarea
                                    value={input}
                                    onChange={this.handleInputChange}
                                    // onKeyPress={this.handleKeyPress}
                                    placeholder="Type a message..."
                                    className="multi-line-input"
                                />
                                <button onClick={this.handleSendMessage} className="send-button">
                                    <i class="fas fa-paper-plane"></i>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    language: state.app.language,
    messages: state.chat.messages,
});

const mapDispatchToProps = dispatch => ({
    addMessage: (data) => dispatch(actions.addMessage(data)),
    clearMessages: () => dispatch(actions.clearMessages()),
    loadMessages: () => dispatch(actions.loadMessages()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatBotComponent);
