// App.js
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import UserList from './components/UserList';
import './App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState(''); // State to track the search query

  // Define the handleSearch function to update the searchQuery state
  const handleSearch = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  return (
    <div className="App">
      <Header handleSearch={handleSearch} />
      <UserList searchQuery={searchQuery} />
    </div>
  );
}

export default App;
