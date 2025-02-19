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
    courseName: '',
    semester: '',
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
            content: `Génère un syllabus détaillé pour le cours "${userMessage}" avec des valeurs pour chaque section :
            
            **Nom du Cours** : (ex: Introduction à la Programmation)
            **Semestre** : (ex: S1 2024)
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

      console.log('API Key exists:', !!import.meta.env.VITE_REACT_APP_API_KEY);

      const data = await response.json();
      console.log('Raw API Response:', data);
      if (!response.ok) throw new Error(data.error?.message || 'Erreur API');

      const aiResponse = data.choices[0].message.content;
      console.log('AI Response:', aiResponse);
      const newSyllabus = parseSyllabus(aiResponse);
      console.log('Parsed Syllabus:', newSyllabus);
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
    console.log('Text to parse:', text);

    const patterns = {
      courseName: /\*\*Nom du Cours\*\* : ([^\n]+)/,
      semester: /\*\*Semestre\*\* : ([^\n]+)/,
      ectsCredits: /\*\*Crédits ECTS\*\* : ([^\n]+)/,
      hours: /\*\*Nombre d'heures dispensées\*\* : ([^\n]+)/,
      lectures: /\*\*Cours Magistraux\*\* : ([^\n]+)/,
      tutorials: /\*\*Travaux Dirigés\*\* : ([^\n]+)/,
      practicals: /\*\*Travaux Pratiques\*\* : ([^\n]+)/,
      projects: /\*\*Projets\*\* : ([^\n]+)/,
      mainTeacher: /\*\*Enseignant référent\*\* : ([^\n]+)/,
      teachingTeam: /\*\*Equipe d'enseignants\*\* : ([^\n]+)/,
      teachingMethod: /\*\*Modalité pédagogique\*\* : ([^\n]+)/,
      language: /\*\*Langue\*\* : ([^\n]+)/,
      objectives: /\*\*Objectifs pédagogiques\*\* : ([^]*?)(?=\*\*|$)/,
      prerequisites: /\*\*Pré requis\*\* : ([^]*?)(?=\*\*|$)/,
      content: /\*\*Contenu\*\* : ([^]*?)(?=\*\*|$)/,
      skills: /\*\*Compétences à acquérir\*\* : ([^]*?)(?=\*\*|$)/,
      evaluation: /\*\*Modalités d'évaluation\*\* : ([^]*?)(?=\*\*|$)/,
      references: /\*\*Références externes\*\* : ([^]*?)(?=\*\*|$)/
    };

    const syllabus = {};

    for (const [key, pattern] of Object.entries(patterns)) {
      const match = text.match(pattern);
      syllabus[key] = match ? match[1].trim() : 'Non spécifié';
      console.log(`Parsing ${key}:`, syllabus[key]); // Pour déboguer
    }

    return syllabus;
  }

  const handleSyllabusChange = (field, value) => {
    setSyllabus(prev => ({
      ...prev,
      [field]: value
    }));
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
              placeholder="Demandez un syllabus sur ..."
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
          <SyllabusTemplate
            syllabus={syllabus}
            onChange={handleSyllabusChange}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
