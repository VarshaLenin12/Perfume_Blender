import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TopNoteSelector.css';

const topNotes = {
  Citrus: {
    image: process.env.PUBLIC_URL + '/images/citrus.png',
    options: ['Lemon', 'Bergamot', 'Orange'],
  },
  Aquatic: {
    image: process.env.PUBLIC_URL + '/images/aquatic.png',
    options: ['Marine', 'Aquatic'],
  },
  Green: {
    image: process.env.PUBLIC_URL + '/images/green.png',
    options: ['Grass', 'Galbanum', 'Green Tea'],
  },
  Aromatic: {
    image: process.env.PUBLIC_URL + '/images/aromatic.png',
    options: ['Lavender', 'Mint'],
  },
  Fruity: {
    image: process.env.PUBLIC_URL + '/images/fruity.png',
    options: ['Apple', 'Pear', 'Berries'],
  }
};


export default function TopNoteSelector() {
  const [selectedTopNote, setSelectedTopNote] = useState(null);
  const [selectedSubNotes, setSelectedSubNotes] = useState([]);
  const [showFlaskModal, setShowFlaskModal] = useState(false);
  const flaskRef = useRef(null);
  const navigate = useNavigate();

  const handleSubNoteClick = (note, event) => {
    if (selectedSubNotes.length >= 2 || selectedSubNotes.includes(note)) return;

    const updated = [...selectedSubNotes, note];
    setSelectedSubNotes(updated);
    localStorage.setItem('topNotes', JSON.stringify(updated));

    const button = event.target;
    const flyingElem = document.createElement('img');
    flyingElem.className = 'flying-note';
    flyingElem.src = process.env.PUBLIC_URL + `/images/${note.toLowerCase().replace(/ /g, '-')}.png`;
    flyingElem.alt = note;

    const rect = button.getBoundingClientRect();
    flyingElem.style.left = `${rect.left}px`;
    flyingElem.style.top = `${rect.top}px`;

    document.body.appendChild(flyingElem);

    const flask = flaskRef.current.getBoundingClientRect();

    requestAnimationFrame(() => {
      flyingElem.style.transform = `translate(${flask.left - rect.left}px, ${flask.top - rect.top}px)`;
      flyingElem.style.opacity = 0;
    });

    setTimeout(() => flyingElem.remove(), 2500);
  };

  const handleRemoveNote = (note) => {
    const updated = selectedSubNotes.filter(n => n !== note);
    setSelectedSubNotes(updated);
    localStorage.setItem('topNotes', JSON.stringify(updated));
  };

  const handleFlaskClick = () => setShowFlaskModal(true);
  const closeModal = () => setShowFlaskModal(false);

  const handleNext = () => {
    navigate('/heart', { state: { topNotes: selectedSubNotes } });
  };

  return (
    <div className="top-note-container">
      <h2>Choose a Top Note</h2>
      <div className="note-grid">
        {Object.entries(topNotes).map(([category, data]) => (
          <div
            key={category}
            className="note-tile enlarged-tile"
            onClick={() => setSelectedTopNote(category)}
          >
            <img src={data.image} alt={category} className="note-image" />
            <div className="note-title">{category}</div>

            {selectedTopNote === category && (
              <div className="sub-options">
                {data.options.map((option) => (
                  <button
                    key={option}
                    className="sub-button"
                    onClick={(e) => handleSubNoteClick(option, e)}
                    disabled={selectedSubNotes.includes(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flask-container" onClick={handleFlaskClick}>
        <img
          ref={flaskRef}
          src={process.env.PUBLIC_URL + '/images/flask.png'}
          alt="Flask"
          className="flask-image"
        />
      </div>

      {showFlaskModal && (
        <div className="flask-modal">
          <div className="flask-modal-content">
            <h3>Selected Top Notes</h3>
            {selectedSubNotes.length === 0 ? (
              <p>No ingredients selected.</p>
            ) : (
              <ul>
                {selectedSubNotes.map((note) => (
                  <li key={note}>
                    <img
                      src={process.env.PUBLIC_URL + `/images/${note.toLowerCase().replace(/ /g, '-')}.png`}
                      alt={note}
                      className="modal-note-image"
                    />
                    <span>{note}</span>
                    <button onClick={() => handleRemoveNote(note)}>Remove</button>
                  </li>
                ))}
              </ul>
            )}
            <button className="close-button" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}

      {selectedSubNotes.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button className="next-button" onClick={handleNext}>Next</button>
        </div>
      )}
    </div>
  );
}
