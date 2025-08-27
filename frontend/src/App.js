import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopNoteSelector from './components/TopNoteSelector';
import HeartNoteSelector from './components/HeartnoteSelector';
import BaseNoteSelector from './components/BaseNoteSelector';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TopNoteSelector />} />
        <Route path="/heart" element={<HeartNoteSelector />} />
        <Route path="/base" element={<BaseNoteSelector />} />
      </Routes>
    </Router>
  );
}

export default App;
