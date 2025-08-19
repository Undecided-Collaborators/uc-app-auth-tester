import { useEffect, useState } from "react";
import './style.css';

// --- ICONS ---
const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
    <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 111.8 512 0 398.2 0 256S111.8 0 244 0c69.8 0 130.8 28.7 173.4 75.2l-67.6 67.6C313.3 112.5 280.8 96 244 96c-88.6 0-160.2 71.6-160.2 160s71.6 160 160.2 160c92.2 0 144.1-65.2 149.4-98.6H244v-73.6h244c2.6 14.7 4.1 30.1 4.1 46.4z"></path>
  </svg>
);

const GithubIcon = () => (
  <svg className="w-5 h-5 mr-2" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="github" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
    <path fill="currentColor" d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3.3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 0-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.3-11.1-29.9 2.6-62.3 0 0 21.6-6.9 70.7 26.3 20.9-5.9 43.1-8.8 66.1-8.8 23.1 0 45.2 2.9 66.1 8.8 49.1-33.2 70.7-26.3 70.7-26.3 13.8 32.4 5.2 56 2.6 62.3 16 17.6 23.6 31.4 23.6 58.9 0 96.5-56.6 104.2-112.6 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.9 1.3 1.6-1.3 1.6-3.6 0-5.9-1.6-2.3-4.3-3.3-5.9-1.3z"></path>
  </svg>
);

// --- MAIN APP COMPONENT ---
export default function App() {
  // State for API URL
  const [apiUrl, setApiUrl] = useState('http://localhost:5001');
  
  // State for auth token, user profile, and UI messages
  const [authToken, setAuthToken] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [message, setMessage] = useState('Click "Fetch Profile" to see data.');
  const [error, setError] = useState('');

  // State for form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // State to toggle between Login and Sign Up views
  const [authView, setAuthView] = useState('login');

  // Effect to check for token in URL on page load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      setAuthToken(token);
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  // --- AUTHENTICATION HANDLERS ---
  const handleApiResponse = (data: { token: ''; message: string; }) => {
    if (data.token) {
      setAuthToken(data.token);
      setError('');
      setUserProfile(null);
      setMessage('Successfully authenticated! Click "Fetch Profile".');
    } else {
      setError(data.message || 'An unknown error occurred.');
    }
  };

  const handleRegister = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      handleApiResponse(data);
    } catch (err) {
      console.log(err)
      setError('Failed to connect to the server.');
    }
  };

  const handleLogin = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      handleApiResponse(data);
    } catch (err) {
      console.log(err)
      setError('Failed to connect to the server.');
    }
  };
  
  const handleLogout = () => {
    setAuthToken('');
    setUserProfile(null);
    setError('');
    setMessage('Click "Fetch Profile" to see data.');
    setName('');
    setEmail('');
    setPassword('');
  };

  const handleGoogleLogin = () => { window.location.href = `${apiUrl}/auth/google`; };
  const handleGithubLogin = () => { window.location.href = `${apiUrl}/auth/github`; };

  // --- API CALL HANDLER ---
  const fetchProfile = async () => {
    if (!authToken) {
      setMessage('You must log in to fetch your profile.');
      return;
    }
    setMessage('Fetching profile...');
    try {
      const response = await fetch(`${apiUrl}/profile`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${authToken}` },
      });
      if (!response.ok) throw new Error(`Authentication failed. Status: ${response.status}`);
      const data = await response.json();
      setUserProfile(data.user);
      setMessage('Profile fetched successfully!');
    } catch (err) {
      if (err) {
        setMessage(`Error: ${err}`);
        setUserProfile(null);
      }
    }
  };

  // --- RENDER ---
  const renderAuthForms = () => (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        <button onClick={() => setAuthView('login')} className={`py-2 px-4 font-semibold ${authView === 'login' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 cursor-pointer'}`}>Login</button>
        <button onClick={() => setAuthView('signup')} className={`py-2 px-4 font-semibold ${authView === 'signup' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 cursor-pointer'}`}>Sign Up</button>
      </div>

      {/* Form */}
      <form onSubmit={authView === 'login' ? handleLogin : handleRegister} className="space-y-4">
        {authView === 'signup' && (
          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-gray-900 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        )}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-gray-900 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-gray-900 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        <button type="submit" className="w-full px-4 py-3 font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors duration-300 shadow-lg cursor-pointer">
          {authView === 'login' ? 'Login' : 'Sign Up'}
        </button>
      </form>
      
      {error && <p className="text-red-400 text-center">{error}</p>}

      {/* Social Logins */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-700"></div></div>
        <div className="relative flex justify-center text-sm"><span className="px-2 bg-gray-800 text-gray-500">Or continue with</span></div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <button onClick={handleGoogleLogin} className="flex items-center justify-center w-full px-4 py-3 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-300 shadow-lg cursor-pointer"><GoogleIcon />Google</button>
        <button onClick={handleGithubLogin} className="flex items-center justify-center w-full px-4 py-3 font-semibold text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-300 shadow-lg cursor-pointer"><GithubIcon />GitHub</button>
      </div>
    </div>
  );

  const renderProfileViewer = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-cyan-400">Authenticated Session</h2>
        <button onClick={handleLogout} className="px-4 py-2 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-300 shadow-lg cursor-pointer">Logout</button>
      </div>
      <div>
        <h3 className="text-xl font-semibold border-b-2 border-gray-700 pb-2 text-cyan-400">Authentication Token</h3>
        <div className="bg-gray-900 p-4 mt-2 rounded-lg text-gray-300 text-sm break-words h-28 overflow-y-auto shadow-inner">{authToken}</div>
      </div>
      <div>
        <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-cyan-400">User Profile</h3>
            <button onClick={fetchProfile} className="px-4 py-2 font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors duration-300 shadow-lg cursor-pointer">Fetch Profile</button>
        </div>
        <pre className="bg-gray-900 p-4 mt-2 rounded-lg text-gray-300 h-48 overflow-y-auto shadow-inner">
          <code>{userProfile ? JSON.stringify(userProfile, null, 2) : message}</code>
        </pre>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center font-sans p-4">
      <div className="w-full max-w-2xl mx-auto bg-gray-800 rounded-xl shadow-2xl p-8 md:p-12 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-cyan-400">UC App Auth Tester</h1>
        </div>
        
        {/* API URL Input */}
        <div className="space-y-2">
            <label htmlFor="api-url" className="font-semibold text-gray-400">Backend API URL</label>
            <input id="api-url" type="text" value={apiUrl} onChange={(e) => setApiUrl(e.target.value)} className="w-full bg-gray-900 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        </div>
        
        <hr className="border-gray-700" />

        {authToken ? renderProfileViewer() : renderAuthForms()}
      </div>
    </div>
  );
}
