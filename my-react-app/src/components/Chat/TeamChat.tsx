import React, { useState, useEffect, useRef } from 'react'
import useSocket from '../../hooks/useSocket'
import './TeamChat.css'
import type { Message } from './Types'

const TeamChat: React.FC = () => {
  const socket = useSocket()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Generate a simple user ID since we don't have token-based auth
  const userId = useRef(`user_${Math.random().toString(36).substr(2, 9)}`)
  const username = useRef(`User_${Math.random().toString(36).substr(2, 4)}`)

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Socket connection and event handling (based on reference component)
  useEffect(() => {
    if (!socket) return

    const handleConnect = () => {
      console.log('connection established', new Date().toISOString())
      setIsConnected(true)
      
      // Emit join event when connected
      socket.emit('join', {
        room: 'team-chat',
        user: {
          id: userId.current,
          name: username.current
        }
      })
    }

    const handleDisconnect = (reason: any) => {
      console.log('socket disconnected', reason)
      setIsConnected(false)
    }

    const handleError = (error: any) => {
      console.log('connection error', error)
      setIsConnected(false)
    }

    // Message handlers
    const handleReceiveMessage = (data: {
      id: string
      userId: string
      username: string
      message: string
      timestamp: string
    }) => {
      console.log('Received message:', data)
      const newMsg: Message = {
        ...data,
        timestamp: new Date(data.timestamp)
      }
      setMessages(prev => [...prev, newMsg])
    }

    const handleUserJoined = (data: { username: string; users: string[] }) => {
      console.log('User joined:', data)
      setOnlineUsers(data.users)
      const systemMsg: Message = {
        id: Date.now().toString(),
        userId: 'system',
        username: 'System',
        message: `${data.username} joined the chat`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, systemMsg])
    }

    const handleUserLeft = (data: { username: string; users: string[] }) => {
      console.log('User left:', data)
      setOnlineUsers(data.users)
      const systemMsg: Message = {
        id: Date.now().toString(),
        userId: 'system',
        username: 'System',
        message: `${data.username} left the chat`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, systemMsg])
    }

    // Set up socket event listeners
    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)
    socket.on('connect_error', handleError)
    socket.on('receiveMessage', handleReceiveMessage)
    socket.on('userJoined', handleUserJoined)
    socket.on('userLeft', handleUserLeft)

    // If socket is already connected, emit join with the room id
    if (socket.connected) {
      console.log('Socket already connected, emitting join')
      setIsConnected(true)
      socket.emit('join', {
        room: 'team-chat',
        user: {
          id: userId.current,
          name: username.current
        }
      })
    } else {
      // Connect the socket if it's not already connected
      console.log('Connecting socket...')
      socket.connect()
    }

    // Cleanup function
    return () => {
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
      socket.off('connect_error', handleError)
      socket.off('receiveMessage', handleReceiveMessage)
      socket.off('userJoined', handleUserJoined)
      socket.off('userLeft', handleUserLeft)
    }
  }, [socket])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!socket || !newMessage.trim() || !isConnected) return

    const messageData = {
      room: 'team-chat',
      content: newMessage.trim(),
      user: {
        id: userId.current,
        name: username.current,
        email: `${username.current}@example.com`
      }
    }

    console.log('Sending message:', messageData)
    socket.emit('sendMessage', messageData)
    
    // Add message to local state immediately (optimistic update)
    const localMsg: Message = {
      id: Date.now().toString(),
      userId: userId.current,
      username: username.current,
      message: newMessage.trim(),
      timestamp: new Date()
    }
    setMessages(prev => [...prev, localMsg])
    
    setNewMessage('')
  }

  const handleLeaveChat = () => {
    if (!socket) return
    
    socket.emit('leave', {
      room: 'team-chat',
      user: {
        id: userId.current,
        name: username.current
      }
    })
  }

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="team-chat-container">
      <div className="chat-header">
        <div className="header-left">
          <h2>Team Chat</h2>
          <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
            <span className="status-dot"></span>
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>
        <div className="header-right">
          <span className="online-count">
            {onlineUsers.length} online
          </span>
          <button 
            className="leave-btn"
            onClick={handleLeaveChat}
            disabled={!isConnected}
          >
            Leave Chat
          </button>
        </div>
      </div>

      <div className="chat-body">
        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="no-messages">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`message ${msg.userId === userId.current ? 'own-message' : ''} ${msg.userId === 'system' ? 'system-message' : ''}`}
              >
                <div className="message-header">
                  <span className="username">{msg.username}</span>
                  <span className="timestamp">{formatTime(msg.timestamp)}</span>
                </div>
                <div className="message-content">
                  {msg.message}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>  

        <form className="message-input-form" onSubmit={handleSendMessage}>
          <div className="input-container">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={isConnected ? "Type your message..." : "Connecting..."}
              disabled={!isConnected}
              className="message-input"
            />
            <button 
              type="submit" 
              disabled={!isConnected || !newMessage.trim()}
              className="send-button"
            >
              Send
            </button>
          </div>
        </form>
      </div>

      {onlineUsers.length > 0 && (
        <div className="online-users">
          <h4>Online Users ({onlineUsers.length})</h4>
          <div className="users-list">
            {onlineUsers.map((username, index) => (
              <span key={index} className="online-user">
                <span className="user-dot"></span>
                {username}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TeamChat