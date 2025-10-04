import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import Agents from './pages/Agents';
import Inquiries from './pages/Inquiries';
import Analytics from './pages/Analytics';
import './styles/App.css';

function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/properties') {
      return location.pathname === '/properties' || location.pathname.startsWith('/properties/');
    }
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h1>Real Estate Platform</h1>
        <nav>
          <Link to="/properties" className={isActive('/properties') ? 'active' : ''}>
            Properties
          </Link>
          <Link to="/agents" className={isActive('/agents') ? 'active' : ''}>
            Agents
          </Link>
          <Link to="/inquiries" className={isActive('/inquiries') ? 'active' : ''}>
            Inquiries
          </Link>
          <Link to="/analytics" className={isActive('/analytics') ? 'active' : ''}>
            Analytics
          </Link>
        </nav>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Properties />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:id" element={<PropertyDetail />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/inquiries" element={<Inquiries />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
