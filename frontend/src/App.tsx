import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SearchBar from './components/Search/SearchBar'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/search" replace/>}/>
        <Route path="/search" element={<SearchBar />}/>
    </Routes>
    </Router>
  );
}

export default App
