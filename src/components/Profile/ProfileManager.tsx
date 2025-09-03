import React, { useState } from 'react';
import { User, Settings, Camera, Save, AlertTriangle, Calendar, FileText, Phone, Mail } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ROLE_LABELS } from '../../types';

const ProfileManager: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    profilePhoto: user?.profilePhoto || ''
  });

  if (!user) return null;

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email || '',
      phone: user.phone || '',
      profilePhoto: user.profilePhoto || ''
    });
    setIsEditing(false);
  };

  const getExpirationWarnings = () => {
    if (!user.hrData) return [];
    
    const warnings = [];
    const now = new Date();
    const tenDaysFromNow = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);

    const checkExpiration = (date: Date | undefined, label: string) => {
      if (date && new Date(date) <= tenDaysFromNow) {
        warnings.push({
          label,
          date: new Date(date),
          isExpired: new Date(date) < now
        });
      }
    };

    checkExpiration(user.hrData.contractEnd, 'Contrat');
    checkExpiration(user.hrData.medicalVisitEnd, 'Visite médicale');
    checkExpiration(user.hrData.derogationEnd, 'Dérogation');
    checkExpiration(user.hrData.inductionEnd, 'Induction');

    return warnings;
  };

  const warnings = getExpirationWarnings();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Alerts */}
      {warnings.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800 mb-2">Alertes d'expiration</h3>
              <div className="space-y-1">
                {warnings.map((warning, index) => (
                  <p key={index} className={`text-sm ${warning.isExpired ? 'text-red-700' : 'text-yellow-700'}`}>
                    {warning.label}: {warning.date.toLocaleDateString('fr-FR')} 
                    {warning.isExpired ? ' (Expiré)' : ' (Expire bientôt)'}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="relative">
            <div className="h-20 w-20 sm:h-24 sm:w-24 bg-blue-100 rounded-full flex items-center justify-center">
              {user.profilePhoto ? (
                <img 
                  src={user.profilePhoto} 
                  alt="Profile" 
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <User className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600" />
              )}
            </div>
            {isEditing && (
              <button className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700 transition-colors">
                <Camera className="h-3 w-3" />
              </button>
            )}
          </div>
          
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{user.name || 'Utilisateur'}</h1>
            <p className="text-gray-600 mt-1">{ROLE_LABELS[user.role]}</p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
              <span>Membre depuis {user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : user.hireDate ? new Date(user.hireDate).toLocaleDateString('fr-FR') : 'Date inconnue'}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                (user.isActive !== false && user.status !== 'inactive') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {(user.isActive !== false && user.status !== 'inactive') ? 'Actif' : 'Inactif'}
              </span>
            </div>
          </div>

          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            {isEditing ? (
              <>
                <Save className="h-4 w-4" />
                <span>Enregistrer</span>
              </>
            ) : (
              <>
                <Settings className="h-4 w-4" />
                <span>Modifier</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom complet
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            ) : (
              <p className="text-gray-900">{user.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rôle
            </label>
            <p className="text-gray-900">{ROLE_LABELS[user.role]}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="h-4 w-4 inline mr-1" />
              Email
            </label>
            {isEditing ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="votre.email@exemple.com"
              />
            ) : (
              <p className="text-gray-900">{user.email || 'Non renseigné'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="h-4 w-4 inline mr-1" />
              Téléphone
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="+241 XX XX XX XX"
              />
            ) : (
              <p className="text-gray-900">{user.phone || 'Non renseigné'}</p>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="flex flex-col sm:flex-row items-center justify-end space-y-3 sm:space-y-0 sm:space-x-4 mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={handleCancel}
              className="w-full sm:w-auto px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Save className="h-4 w-4" />
              <span>Enregistrer</span>
            </button>
          </div>
        )}
      </div>

      {/* HR Information */}
      {user.hrData && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations RH</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Contract */}
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900 flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Contrat
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Début: {user.hrData.contractStart ? new Date(user.hrData.contractStart).toLocaleDateString('fr-FR') : 'Non renseigné'}</p>
                <p>Fin: {user.hrData.contractEnd ? new Date(user.hrData.contractEnd).toLocaleDateString('fr-FR') : 'Non renseigné'}</p>
              </div>
            </div>

            {/* Medical Visit */}
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Visite médicale
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Début: {user.hrData.medicalVisitStart ? new Date(user.hrData.medicalVisitStart).toLocaleDateString('fr-FR') : 'Non renseigné'}</p>
                <p>Fin: {user.hrData.medicalVisitEnd ? new Date(user.hrData.medicalVisitEnd).toLocaleDateString('fr-FR') : 'Non renseigné'}</p>
              </div>
            </div>

            {/* Derogation */}
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">Dérogation</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Début: {user.hrData.derogationStart ? new Date(user.hrData.derogationStart).toLocaleDateString('fr-FR') : 'Non renseigné'}</p>
                <p>Fin: {user.hrData.derogationEnd ? new Date(user.hrData.derogationEnd).toLocaleDateString('fr-FR') : 'Non renseigné'}</p>
              </div>
            </div>

            {/* Induction */}
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">Induction</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Début: {user.hrData.inductionStart ? new Date(user.hrData.inductionStart).toLocaleDateString('fr-FR') : 'Non renseigné'}</p>
                <p>Fin: {user.hrData.inductionEnd ? new Date(user.hrData.inductionEnd).toLocaleDateString('fr-FR') : 'Non renseigné'}</p>
              </div>
            </div>

            {/* CNSS Number */}
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">Numéro CNSS</h3>
              <p className="text-sm text-gray-600">{user.hrData.cnssNumber || 'Non renseigné'}</p>
            </div>

            {/* Payroll Number */}
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">Numéro de paie</h3>
              <p className="text-sm text-gray-600">{user.hrData.payrollNumber || 'Non renseigné'}</p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> Les informations RH sont gérées par le service des ressources humaines. 
              Pour toute modification, veuillez contacter la DRH.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileManager;