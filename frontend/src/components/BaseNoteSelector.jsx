import React, { useState, useRef } from 'react';
import '../styles/TopNoteSelector.css'; // same CSS used



const baseNotes = {
  'Woody Oriental': {
    image: process.env.PUBLIC_URL + '/images/woody-oriental.png',
    options: ['Patchouli'],
  },
  Woods: {
    image: process.env.PUBLIC_URL + '/images/woods.png',
    options: ['Cedarwood', 'Sandalwood', 'Vetiver'],
  },
  'Dry Woods': {
    image: process.env.PUBLIC_URL + '/images/dry-woods.png',
    options: ['Leather', 'Tobacco'],
  },
  'Mossy Woods': {
    image: process.env.PUBLIC_URL + '/images/mossy-woods.png',
    options: ['Oakmoss', 'Amber'],
  },
  Oriental: {
    image: process.env.PUBLIC_URL + '/images/oriental.png',
    options: ['Resins', 'Spices'],
  },
  'Soft Oriental': {
    image: process.env.PUBLIC_URL + '/images/soft-oriental.png',
    options: ['Vanilla', 'Incense', 'Musk'],
  },
};

export default function BaseNoteSelector() {
  const [selectedBaseNote, setSelectedBaseNote] = useState(null);
  const [selectedSubNotes, setSelectedSubNotes] = useState([]);
  const [showFlaskModal, setShowFlaskModal] = useState(false);
  const flaskRef = useRef(null);
  const [prediction, setPrediction] = useState(null);


  const topNotes = JSON.parse(localStorage.getItem('topNotes') || '[]');
  const middleNotes = JSON.parse(localStorage.getItem('heartNotes') || '[]');

  const handleSubNoteClick = (note, event) => {
    if (selectedSubNotes.length >= 2 || selectedSubNotes.includes(note)) return;

    const updatedNotes = [...selectedSubNotes, note];
    setSelectedSubNotes(updatedNotes);

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

    setTimeout(() => {
      flyingElem.remove();
    }, 2500);
  };

  const handleFlaskClick = () => {
    setShowFlaskModal(true);
  };

  const handleRemoveNote = (note) => {
    const updated = selectedSubNotes.filter((n) => n !== note);
    setSelectedSubNotes(updated);
  };

  const closeModal = () => {
    setShowFlaskModal(false);
  };

  const handlePredict = async () => {
  try {
    const response = await fetch('http://localhost:5000/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        top: topNotes,
        middle: middleNotes,
        base: selectedSubNotes,
      }),
    });

    const data = await response.json();
    setPrediction(data.prediction);
  } catch (error) {
    console.error('Error predicting main accord:', error);
    setPrediction('Prediction failed. Please try again.');
  }
};


  return (
    <div className="top-note-container">
      <h2>Choose a Base Note</h2>
      <div className="note-grid">
        {Object.entries(baseNotes).map(([category, data]) => (
          <div
            key={category}
            className="note-tile enlarged-tile"
            onClick={() => setSelectedBaseNote(category)}
          >
            <img src={data.image} alt={category} className="note-image" />
            <div className="note-title">{category}</div>

            {selectedBaseNote === category && (
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
            <h3>Selected Base Notes</h3>
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
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button className="predict-button" onClick={handlePredict}>Predict</button>
        </div>
      )}
      {prediction && (
  <div className="popup-overlay" onClick={() => setPrediction(null)}>
    <div className="popup-box" onClick={(e) => e.stopPropagation()}>
      <h2 className="popup-title">Predicted Main Accord</h2>
      <p className="popup-prediction">{prediction}</p>
      <button className="popup-close-btn" onClick={() => setPrediction(null)}>
        Close
      </button>
    </div>
  </div>
)}

    </div>
  );
}
