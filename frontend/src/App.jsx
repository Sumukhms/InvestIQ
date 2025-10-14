import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import ForgotPasswordPage from './components/ForgotPasswordPage'; // Import the new page

// We will add ScorecardPage back later
// import ScorecardPage from './components/ScorecardPage'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} /> {/* Add the route */}
        
        {/* We will add this route back when ScorecardPage is created */}
        {/* <Route path="/dashboard" element={<ScorecardPage />} />  */}
      </Routes>
    </Router>
  );
}

export default App;