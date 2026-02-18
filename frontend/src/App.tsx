import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import SearchBar from './components/Search/SearchBar'
import BookPage from './pages/BookPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/search" replace/>}/>
        <Route path="/search" element={<SearchBar />} />
        <Route path="book/:work_id" element={<BookPage />} />
    </Routes>
    </Router>
  );
}

export default App
