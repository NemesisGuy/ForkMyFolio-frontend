import React from 'react';

/**
 * A simple greeting component.
 * @param {object} props - The component props.
 * @param {string} props.name - The name to greet.
 * @returns {JSX.Element} The SimpleGreeter component.
 */
const SimpleGreeter = ({ name }) => {
  return (
    <h1>Hello, {name}!</h1>
  );
};

export default SimpleGreeter;
