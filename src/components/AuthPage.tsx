import { useState } from 'react';
import { Mail, Lock, User, ShieldCheck } from 'lucide-react';
import logoImage from 'figma:asset/7c4083828d48eb428c4a638e45ca05fe81ab6548.png';

interface AuthPageProps {
  onLogin: (email: string, password: string, isAdmin: boolean) => void;
}

export function AuthPage({ onLogin }: AuthPageProps) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password, isAdminLogin);
  };

  // Demo credentials helper
  const fillDemoCredentials = (type: 'citizen' | 'admin') => {
    if (type === 'citizen') {
      setEmail('citizen@demo.com');
      setPassword('citizen123');
      setIsAdminLogin(false);
    } else {
      setEmail('admin@nagarnetra.gov');
      setPassword('admin123');
      setIsAdminLogin(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img 
              src={logoImage}
              alt="NagarNetra Logo"
              className="h-16 w-16 rounded-xl object-cover shadow-lg"
            />
            <div className="text-left">
              <h1 className="text-white text-3xl tracking-tight">NagarNetra</h1>
              <p className="text-blue-200 text-sm">AI-Powered Civic Reporting</p>
            </div>
          </div>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-xl shadow-xl p-8">
          {/* Toggle Login/Signup */}
          <div className="flex gap-2 mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setIsLoginMode(true)}
              className={`flex-1 py-2 rounded-md transition-colors ${
                isLoginMode
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLoginMode(false)}
              className={`flex-1 py-2 rounded-md transition-colors ${
                !isLoginMode
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field (Sign Up Only) */}
            {!isLoginMode && (
              <div>
                <label className="block text-gray-700 mb-2 text-sm">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required={!isLoginMode}
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-gray-700 mb-2 text-sm">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-gray-700 mb-2 text-sm">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Admin Toggle (Login Only) */}
            {isLoginMode && (
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="adminToggle"
                  checked={isAdminLogin}
                  onChange={(e) => setIsAdminLogin(e.target.checked)}
                  className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="adminToggle" className="text-sm text-gray-700 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  Login as Administrator
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isLoginMode ? 'Login' : 'Create Account'}
            </button>
          </form>

          {/* Demo Credentials */}
          {isLoginMode && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center mb-3">Try demo accounts:</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('citizen')}
                  className="text-xs px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  👤 Citizen Demo
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('admin')}
                  className="text-xs px-3 py-2 border border-blue-300 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  🛡️ Admin Demo
                </button>
              </div>
            </div>
          )}

          {/* Footer Text */}
          {isLoginMode ? (
            <p className="text-center text-sm text-gray-600 mt-6">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setIsLoginMode(false)}
                className="text-blue-600 hover:text-blue-700"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p className="text-center text-sm text-gray-600 mt-6">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsLoginMode(true)}
                className="text-blue-600 hover:text-blue-700"
              >
                Login
              </button>
            </p>
          )}
        </div>

        {/* Security Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-blue-100">
            🔒 Secure authentication • Government-verified platform
          </p>
        </div>
      </div>
    </div>
  );
}