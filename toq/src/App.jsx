import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import SyllabusTemplate from './SyllabusTemplate';

const ChatMessage = ({ message, isUser }) => (
  <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}>
    <div className={`max-w-[75%] p-4 rounded-2xl shadow-md transition-all duration-200 ${isUser ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-gray-200 text-gray-900 rounded-tl-none'}`}>
      <p className="text-sm md:text-base break-words">{message}</p>
    </div>
  </div>
);

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [syllabus, setSyllabus] = useState({
    ectsCredits: '',
    hours: '',
    lectures: '',
    tutorials: '',
    practicals: '',
    projects: '',
    mainTeacher: '',
    teachingTeam: '',
    teachingMethod: '',
    language: '',
    objectives: '',
    prerequisites: '',
    content: '',
    skills: '',
    evaluation: '',
    references: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, syllabus]);

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
          'Authorization': `Bearer ${import.meta.env.VITE_GPT4_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [{ role: "user", content: `Génère un syllabus détaillé pour : ${userMessage}` }],
          temperature: 0.7
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Erreur API');

      const aiResponse = data.choices[0].message.content;
      const newSyllabus = parseSyllabus(aiResponse);
      setSyllabus(newSyllabus);
      setGenerated(true);
    } catch (error) {
      console.error('Erreur:', error);
      setMessages(prev => [...prev, { text: "Erreur lors de la génération.", isUser: false }]);
      setGenerated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const parseSyllabus = (text) => {
    // Implémentez une fonction qui analyse et extrait le contenu du syllabus à partir du texte généré
    // et retourne un objet correspondant à la structure du syllabus.
    return {
      ectsCredits: '5',
      hours: '40',
      lectures: '20',
      tutorials: '10',
      practicals: '5',
      projects: '5',
      mainTeacher: 'Dr. Smith',
      teachingTeam: 'Dr. Smith, Dr. Doe',
      teachingMethod: 'Présentiel',
      language: 'Français',
      objectives: 'Apprendre les bases de la programmation.',
      prerequisites: 'Aucun',
      content: 'Introduction à la programmation, variables, boucles, etc.',
      skills: 'Programmation de base',
      evaluation: 'Examen final, travaux pratiques',
      references: 'Livre A, Livre B'
    };
  };

  const handleSyllabusChange = (field, value) => {
    setSyllabus(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl flex overflow-hidden">
        {/* Chatbot Section */}
        <div className={`w-full md:w-1/2 p-6 flex flex-col transition-all duration-500 ${generated ? 'md:animate-move-left md:w-1/2' : ''}`}>
          <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Assistant IA</h1>
          <div className="h-[65vh] overflow-y-auto pr-4 flex flex-col space-y-4">
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message.text} isUser={message.isUser} />
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Demandez un syllabus..."
              className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
            >
              {isLoading ? 'Chargement...' : 'Générer'}
            </button>
          </form>
        </div>

        {/* Syllabus Section */}
        <div className={`w-full md:w-1/2 p-6 bg-gray-100 overflow-y-auto animate-fade-in ${generated ? 'block' : 'hidden'}`}>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Syllabus Généré</h2>
          <SyllabusTemplate syllabus={syllabus} onChange={handleSyllabusChange} />
        </div>
      </div>
    </div>
  );
};

export default App;
