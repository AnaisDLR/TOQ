import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import SyllabusTemplate from './SyllabusTemplate';

const ChatMessage = ({ message, isUser }) => (
  <div className={`chat-message ${isUser ? 'user' : 'ai'} mb-4 animate-fade-in`}>
    <p>{message}</p>
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
          'Authorization': `Bearer ${import.meta.env.VITE_REACT_APP_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [{ 
            role: "user", 
            content: `Génère un syllabus détaillé avec des valeurs pour chaque section :
            
            **Crédits ECTS** : (ex: 5)
            **Nombre d'heures dispensées** : (ex: 40)
            **Cours Magistraux** : (ex: 20)
            **Travaux Dirigés** : (ex: 10)
            **Travaux Pratiques** : (ex: 5)
            **Projets** : (ex: 5)
            **Enseignant référent** : (ex: Dr. Dupont)
            **Equipe d'enseignants** : (ex: Dr. Dupont, Dr. Martin)
            **Modalité pédagogique** : (ex: Présentiel)
            **Langue** : (ex: Français)
            **Objectifs pédagogiques** : (ex: Acquérir les bases de la programmation)
            **Pré requis** : (ex: Aucun)
            **Contenu** : (ex: Introduction, Variables, Boucles, Fonctions)
            **Compétences à acquérir** : (ex: Programmation de base)
            **Modalités d'évaluation** : (ex: Examen final, Travaux pratiques)
            **Références externes** : (ex: Livre A, Livre B)
      
            Remplis chaque section avec des valeurs détaillées.`
          }],
          temperature: 0.7
        }),
      });      
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Erreur API');
  
      const aiResponse = data.choices[0].message.content;
      const newSyllabus = parseSyllabus(aiResponse);
      setSyllabus(newSyllabus);
      setGenerated(true);
  
      // Ajouter un message final de l'IA
      setMessages(prev => [
        ...prev, 
        { text: "Voici le syllabus ! N'hésitez pas à me faire savoir si vous avez d'autres questions ou demandes.", isUser: false }
      ]);
    } catch (error) {
      console.error('Erreur:', error);
      setMessages(prev => [...prev, { text: "Erreur lors de la génération.", isUser: false }]);
      setGenerated(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  const parseSyllabus = (text) => {
    const syllabus = {
      ectsCredits: 'Non spécifié',
      hours: 'Non spécifié',
      lectures: 'Non spécifié',
      tutorials: 'Non spécifié',
      practicals: 'Non spécifié',
      projects: 'Non spécifié',
      mainTeacher: 'Non spécifié',
      teachingTeam: 'Non spécifié',
      teachingMethod: 'Non spécifié',
      language: 'Non spécifié',
      objectives: 'Non spécifié',
      prerequisites: 'Non spécifié',
      content: 'Non spécifié',
      skills: 'Non spécifié',
      evaluation: 'Non spécifié',
      references: 'Non spécifié'
    };
  
    const patterns = {
      ectsCredits: /Crédits ECTS\s*:\s*(.+)/i,
      hours: /Nombre d'heures dispensées\s*:\s*(.+)/i,
      lectures: /Cours Magistraux\s*:\s*(.+)/i,
      tutorials: /Travaux Dirigés\s*:\s*(.+)/i,
      practicals: /Travaux Pratiques\s*:\s*(.+)/i,
      projects: /Projets\s*:\s*(.+)/i,
      mainTeacher: /Enseignant référent\s*:\s*(.+)/i,
      teachingTeam: /Equipe d'enseignants\s*:\s*(.+)/i,
      teachingMethod: /Modalité pédagogique\s*:\s*(.+)/i,
      language: /Langue\s*:\s*(.+)/i,
      objectives: /Objectifs pédagogiques\s*:\s*([\s\S]+?)(?:\n[A-ZÀ-Ú]|$)/i,
      prerequisites: /Pré requis\s*:\s*([\s\S]+?)(?:\n[A-ZÀ-Ú]|$)/i,
      content: /Contenu\s*:\s*([\s\S]+?)(?:\n[A-ZÀ-Ú]|$)/i,
      skills: /Compétences à acquérir\s*:\s*([\s\S]+?)(?:\n[A-ZÀ-Ú]|$)/i,
      evaluation: /Modalités d'évaluation\s*:\s*([\s\S]+?)(?:\n[A-ZÀ-Ú]|$)/i,
      references: /Références externes\s*:\s*([\s\S]+)/i
    };
  
    for (const key in patterns) {
      const match = text.match(patterns[key]);
      if (match && match[1].trim()) {
        syllabus[key] = match[1].trim();
      }
    }
  
    return syllabus;
  };  

  const handleSyllabusChange = (field, value) => {
    setSyllabus(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl flex overflow-hidden">
        {/* Chatbot Section */}
        <div className="w-full md:w-1/2 p-6 flex flex-col transition-all duration-500">
  <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Assistant IA</h1>
  <div className="chatbot-container h-[65vh] overflow-y-auto pr-4 flex flex-col space-y-4">
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
<div className={`w-full md:w-1/2 p-6 bg-gray-100 syllabus-container overflow-y-auto animate-fade-in ${generated ? 'block' : 'hidden'}`}>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Syllabus Généré</h2>
          <SyllabusTemplate syllabus={syllabus} onChange={handleSyllabusChange} />
        </div>
      </div>
    </div>
  );
};

export default App;
