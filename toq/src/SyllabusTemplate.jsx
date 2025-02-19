import React, { useState, useRef } from 'react';
import { Save, Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { AzureStorageService } from '../services/azureStorage';

const SyllabusTemplate = ({ syllabus, onChange }) => {
  const [saveStatus, setSaveStatus] = useState('');
  const azureStorage = new AzureStorageService();

  const handleChange = (field, value) => {
    onChange(field, value);
    setSaveStatus('');
  };

  const downloadSyllabus = () => {
    const content = document.createElement('div');
    content.innerHTML = `
      <div style="font-family: Arial, sans-serif;">
        <h1 style="color: #1f7478; font-weight: bold; margin-bottom: 5px;">
          ${syllabus.courseName} - ${syllabus.semester}
        </h1>
        <hr style="border: 2px solid #1f7478; margin-bottom: 20px;">
  
        <p><strong>Crédits ECTS :</strong> ${syllabus.ectsCredits}</p>
        <p><strong>Nombre d'heures dispensées :</strong> ${syllabus.hours}h</p>
  
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>Cours Magistraux</strong><br>${syllabus.lectures}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>Travaux Dirigés</strong><br>${syllabus.tutorials}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>Travaux Pratiques</strong><br>${syllabus.practicals}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>Projets</strong><br>${syllabus.projects}</td>
          </tr>
        </table>
  
        <p><strong>Enseignant référent :</strong> ${syllabus.mainTeacher}</p>
        <p><strong>Équipe d'enseignants :</strong> ${syllabus.teachingTeam}</p>
        <p><strong>Modalité pédagogique :</strong> ${syllabus.teachingMethod}</p>
        <p><strong>Langue :</strong> ${syllabus.language}</p>
  
        <h2 style="color: #1f7478; margin-top: 20px;">Objectifs pédagogiques</h2>
        <hr style="border: 1px solid #1f7478; margin-bottom: 10px;">
        <p>${syllabus.objectives}</p>
  
        <h2 style="color: #1f7478; margin-top: 20px;">Pré requis</h2>
        <hr style="border: 1px solid #1f7478; margin-bottom: 10px;">
        <p>${syllabus.prerequisites}</p>
  
        <h2 style="color: #1f7478; margin-top: 20px;">Contenu</h2>
        <hr style="border: 1px solid #1f7478; margin-bottom: 10px;">
        <p>${syllabus.content}</p>
  
        <h2 style="color: #1f7478; margin-top: 20px;">Compétences à acquérir</h2>
        <hr style="border: 1px solid #1f7478; margin-bottom: 10px;">
        <p>${syllabus.skills}</p>
  
        <h2 style="color: #1f7478; margin-top: 20px;">Modalités d'évaluation</h2>
        <hr style="border: 1px solid #1f7478; margin-bottom: 10px;">
        <p>${syllabus.evaluation}</p>
  
        <h2 style="color: #1f7478; margin-top: 20px;">Références externes</h2>
        <hr style="border: 1px solid #1f7478; margin-bottom: 10px;">
        <p>${syllabus.references}</p>
      </div>
    `;
  
    const options = {
      margin: 1,
      filename: `syllabus_${syllabus.courseName.replace(/\s+/g, '_').toLowerCase()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
  
    html2pdf().from(content).set(options).save();
  };

  const saveSyllabus = async () => {
    try {
      setSaveStatus('Sauvegarde en cours...');
      
      // Sauvegarde locale
      localStorage.setItem('savedSyllabus', JSON.stringify(syllabus));
      
      // Sauvegarde sur Azure
      await azureStorage.saveSyllabus(syllabus);
      
      setSaveStatus('Syllabus sauvegardé avec succès !');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      setSaveStatus('Erreur lors de la sauvegarde');
      console.error('Erreur de sauvegarde:', error);
    }
  };

  const InputField = ({ label, value, onChange, type = "text", isShort = false }) => {
    return (
      <div className={`mb-4 ${isShort ? 'max-w-[200px]' : ''}`}>
        <label className="block text-sm font-medium mb-1 text-white">{label}</label>
        {type === "textarea" ? (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-2 border rounded-lg bg-[#282826] text-white min-h-[100px] resize-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            maxLength={255}
            className="w-full p-2 border rounded-lg bg-[#282826] text-white focus:ring-2 focus:ring-blue-500"
          />
        )}
      </div>
    );
  };

  return (
    <div className="syllabus-template space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-100">Syllabus</h2>
        <div className="flex gap-2">
          <button
            onClick={saveSyllabus}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-black rounded-lg hover:bg-blue-600"
          >
            <Save size={16} />
            Sauvegarder
          </button>
          <button
            onClick={downloadSyllabus}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download size={16} />
            Télécharger
          </button>
        </div>
      </div>

      {saveStatus && (
        <div className="mb-4 p-2 bg-green-800 text-white rounded-lg">
          {saveStatus}
        </div>
      )}

      <InputField
        label="Nom du Cours"
        value={syllabus.courseName}
        onChange={(value) => handleChange('courseName', value)}
      />

      <InputField
        label="Semestre"
        value={syllabus.semester}
        onChange={(value) => handleChange('semester', value)}
      />

      <hr className="border-gray-600 my-6" />

      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Crédits ECTS"
          value={syllabus.ectsCredits}
          onChange={(value) => handleChange('ectsCredits', value)}
          isShort={true}
        />
        <InputField
          label="Nombre d'heures dispensées"
          value={syllabus.hours}
          onChange={(value) => handleChange('hours', value)}
          //isShort={true}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Cours Magistraux"
          value={syllabus.lectures}
          onChange={(value) => handleChange('lectures', value)}
          isShort={true}
        />
        <InputField
          label="Travaux Dirigés"
          value={syllabus.tutorials}
          onChange={(value) => handleChange('tutorials', value)}
          //isShort={true}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Travaux Pratiques"
          value={syllabus.practicals}
          onChange={(value) => handleChange('practicals', value)}
          isShort={true}
        />
        <InputField
          label="Projets"
          value={syllabus.projects}
          onChange={(value) => handleChange('projects', value)}
          //isShort={true}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Enseignant référent"
          value={syllabus.mainTeacher}
          onChange={(value) => handleChange('mainTeacher', value)}
          isShort={true}
        />
        <InputField
          label="Equipe d'enseignants"
          value={syllabus.teachingTeam}
          onChange={(value) => handleChange('teachingTeam', value)}
          //isShort={true}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Modalité pédagogique"
          value={syllabus.teachingMethod}
          onChange={(value) => handleChange('teachingMethod', value)}
          isShort={true}
        />
        <InputField
          label="Langue"
          value={syllabus.language}
          onChange={(value) => handleChange('language', value)}
          //isShort={true}
        />
      </div>


      <InputField
        label="Objectifs pédagogiques"
        value={syllabus.objectives}
        onChange={(value) => handleChange('objectives', value)}
        type="textarea"
      />

      <hr className="border-gray-600 my-6" />

      <InputField
        label="Pré requis"
        value={syllabus.prerequisites}
        onChange={(value) => handleChange('prerequisites', value)}
        type="textarea"
      />

      <hr className="border-gray-600 my-6" />

      <InputField
        label="Contenu"
        value={syllabus.content}
        onChange={(value) => handleChange('content', value)}
        type="textarea"
      />

      <hr className="border-gray-600 my-6" />

      <InputField
        label="Compétences à acquérir"
        value={syllabus.skills}
        onChange={(value) => handleChange('skills', value)}
        type="textarea"
      />

      <hr className="border-gray-600 my-6" />

      <InputField
        label="Modalités d'évaluation"
        value={syllabus.evaluation}
        onChange={(value) => handleChange('evaluation', value)}
        type="textarea"
      />

      <hr className="border-gray-600 my-6" />

      <InputField
        label="Références externes"
        value={syllabus.references}
        onChange={(value) => handleChange('references', value)}
        type="textarea"
      />
    </div>
  );
};

export default SyllabusTemplate;