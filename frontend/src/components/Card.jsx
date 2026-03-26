// Card Component
// Reusable card component for displaying destinations and packages

import React from 'react';
import './Card.css';

function Card({ image, title, description, footer, onClick }) {
  return (
    <div className="card" onClick={onClick}>
      {image && (
        <div className="card-image">
          <img src={image} alt={title} />
        </div>
      )}
      <div className="card-content">
        <h3>{title}</h3>
        {description && <p>{description}</p>}
        {footer && <div className="card-footer">{footer}</div>}
      </div>
    </div>
  );
}

export default Card;
