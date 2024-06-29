import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import SearchPage from './components/SearchPage';
import SearchResultsPage from './components/SearchResultsPage';
import BreweryInfoPage from './components/BreweryInfoPage';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<SearchPage />} />
          <Route path="/results/:searchType/:searchQuery" element={<SearchResultsPage />} />
          <Route path="/brewery/:id" element={<BreweryInfoPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
