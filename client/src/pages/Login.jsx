import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  // useNavigate is a hook for programmatic navigation
  const navigate = useNavigate();
  const { login } = useAuth();

  // State to hold form data
  // useState returns [currentValue, functionToUpdateValue]
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle input changes
  // This updates the state as user types
  const handleChange = (e) => {
    setFormData({
      ...formData, // Spread operator: keeps existing data
      [e.target.name]: e.target.value, // Updates only the changed field
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents page reload
    setError('');
    setLoading(true);

    const result = await login(formData);

    if (result.success) {
      navigate('/dashboard'); // Redirect to dashboard
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  // JSX: HTML-like syntax in JavaScript
  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Family Plan</h1>
        <h2>Login</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
