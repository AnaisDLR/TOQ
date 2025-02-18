import React, { useState, useRef, useEffect } from 'react';
import './App.css';

const ChatMessage = ({ message, isUser }) => (
  <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}>
    <div className={`max-w-[70%] p-4 rounded-2xl shadow-md transform transition-all duration-200 ${isUser ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'} overflow-hidden`}>
      <p className="text-sm md:text-base break-words">{message}</p>
    </div>
  </div>
);

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [syllabus, setSyllabus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
  
    setIsLoading(true);
    const userMessage = input;
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setInput('');
  
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_GPT4_API_KEY}`,
          'If-None-Match': response.headers.get('ETag'),
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [{ role: "user", content: `Generate a syllabus for: ${userMessage}` }],
          temperature: 0.7
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error?.message || 'Une erreur est survenue lors de l\'appel à l\'API');
      }
  
      const aiResponse = data.choices[0].message.content;
      simulateTyping(aiResponse);
    } catch (error) {
      console.error('Erreur:', error);
      setMessages(prev => [...prev, { 
        text: "Désolé, une erreur s'est produite lors de la communication avec l'API.",
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const simulateTyping = (text) => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setSyllabus(prev => (prev || '') + text[index]);
        index++;
      } else {
        clearInterval(interval);
        setMessages(prev => [...prev, { text: "Syllabus généré avec succès!", isUser: false }]);
      }
    }, 50);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-4">
      <div className={`bg-white rounded-2xl shadow-2xl transition-all duration-500 ease-in-out ${syllabus ? 'w-full max-w-6xl flex' : 'w-full max-w-2xl'}`}>
        <div className={`p-6 ${syllabus ? 'w-1/2 border-r' : 'w-full'}`}>
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Assistant Syllabus</h1>
          <div className="h-[60vh] overflow-y-auto mb-4 pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message.text} isUser={message.isUser} />
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Demandez un syllabus sur un sujet..."
                className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'} text-white shadow-md hover:shadow-lg`}
              >
                {isLoading ? 'Génération...' : 'Générer'}
              </button>
            </div>
          </form>
        </div>
        {syllabus && (
          <div className="w-1/2 p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Syllabus Généré</h2>
            <div className="prose max-w-none overflow-y-auto h-[calc(100%-3rem)] whitespace-pre-wrap">
              {syllabus}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;