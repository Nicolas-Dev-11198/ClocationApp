import React, { useState } from 'react';
import { LogIn, Anchor, UserPlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface LoginFormProps {
  onShowRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onShowRegister }) => {
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await login(fullName, password);
      if (!success) {
        setError('Nom d\'utilisateur ou mot de passe incorrect');
      }
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Anchor className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">CLOCATION</h2>
            <p className="text-gray-600 mt-2">Gestion de Flotte de Pirogues</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Nom complet
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
                placeholder="Votre nom complet"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
                placeholder="Votre mot de passe"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              <LogIn className="h-5 w-5" />
              <span>{loading ? 'Connexion...' : 'Se connecter'}</span>
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Pas encore de compte ?{' '}
              <button
                onClick={onShowRegister}
                className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center space-x-1"
              >
                <UserPlus className="h-4 w-4" />
                <span>S'inscrire</span>
              </button>
            </p>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Comptes de démonstration :</strong>
            </p>
            <p className="text-xs text-gray-500">
              • Admin CLOCATION (mot de passe: password123)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;