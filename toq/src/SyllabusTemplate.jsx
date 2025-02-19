import React from 'react';

const SyllabusTemplate = ({ syllabus }) => {
  return (
    <div className="syllabus-template p-4 border rounded-lg bg-white">
      <h1 className="text-2xl font-bold mb-4 text-green-600">Nom du cours et semestre</h1>
      <div className="mb-4">
        <span className="font-bold">Crédits ECTS :</span> <span>{syllabus.ectsCredits}</span>
      </div>
      <div className="mb-4">
        <span className="font-bold">Nombre d'heures dispensées :</span> <span>{syllabus.hours}</span>
      </div>
      <div className="mb-4">
        <span className="font-bold">Cours Magistraux :</span> <span>{syllabus.lectures}</span>
      </div>
      <div className="mb-4">
        <span className="font-bold">Travaux Dirigés :</span> <span>{syllabus.tutorials}</span>
      </div>
      <div className="mb-4">
        <span className="font-bold">Travaux Pratiques :</span> <span>{syllabus.practicals}</span>
      </div>
      <div className="mb-4">
        <span className="font-bold">Projets :</span> <span>{syllabus.projects}</span>
      </div>
      <hr className="border-t-2 border-gray-300 my-4" />
      <div className="mb-4">
        <span className="font-bold">Enseignant référent :</span> <span>{syllabus.mainTeacher}</span>
      </div>
      <div className="mb-4">
        <span className="font-bold">Equipe d'enseignants :</span> <span>{syllabus.teachingTeam}</span>
      </div>
      <div className="mb-4">
        <span className="font-bold">Modalité pédagogique :</span> <span>{syllabus.teachingMethod}</span>
      </div>
      <div className="mb-4">
        <span className="font-bold">Langue :</span> <span>{syllabus.language}</span>
      </div>
      <hr className="border-t-2 border-gray-300 my-4" />
      <div className="mb-4">
        <span className="font-bold">Objectifs pédagogiques :</span> <span>{syllabus.objectives}</span>
      </div>
      <div className="mb-4">
        <span className="font-bold">Pré requis :</span> <span>{syllabus.prerequisites}</span>
      </div>
      <div className="mb-4">
        <span className="font-bold">Contenu :</span> <span>{syllabus.content}</span>
      </div>
      <div className="mb-4">
        <span className="font-bold">Compétences à acquérir :</span> <span>{syllabus.skills}</span>
      </div>
      <hr className="border-t-2 border-gray-300 my-4" />
      <div className="mb-4">
        <span className="font-bold">Modalités d'évaluation :</span> <span>{syllabus.evaluation}</span>
      </div>
      <div className="mb-4">
        <span className="font-bold">Références externes :</span> <span>{syllabus.references}</span>
      </div>
    </div>
  );
};

export default SyllabusTemplate;
