import React, { useState, useEffect } from 'react';
import { parseISO, differenceInYears } from 'date-fns';

import './UserList.css';

const UserList = () => {
  const [celebrities, setCelebrities] = useState([]);
  const [filteredCelebrities, setFilteredCelebrities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editableId, setEditableId] = useState(null);

  useEffect(() => {
    // Fetch data from the JSON file
    fetch('/data/celebrities.json') // Update the path to your JSON file
      .then((response) => response.json())
      .then((data) => {
        setCelebrities(data);
        setFilteredCelebrities(data);
      });
  }, []);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filteredData = celebrities.filter((celebrity) =>
      celebrity.first.toLowerCase().includes(query)
    );
    setFilteredCelebrities(filteredData);
  };

  const toggleOpenClose = (celebrityId) => {
    setFilteredCelebrities((prevCelebrities) =>
      prevCelebrities.map((celebrity) =>
        celebrity.id === celebrityId
          ? { ...celebrity, isOpen: !celebrity.isOpen }
          : celebrity
      )
    );
  };

  const handleEdit = (celebrityId) => {
    setEditableId(celebrityId);
  };

  const handleDelete = (celebrityId) => {
    const confirmation = window.confirm('Are you sure you want to delete?');
    if (confirmation) {
      // Remove the celebrity with the specified ID from the filteredCelebrities
      setFilteredCelebrities((prevCelebrities) =>
        prevCelebrities.filter((celebrity) => celebrity.id !== celebrityId)
      );
    }
  };

  const handleInputChange = (e, celebrityId, field) => {
    const updatedCelebrities = filteredCelebrities.map((celebrity) => {
      if (celebrity.id === celebrityId) {
        return {
          ...celebrity,
          [field]: e.target.value, // Update the specific field in the celebrity
        };
      }
      return celebrity;
    });
  
    // Update both filteredCelebrities and celebrities state
    setFilteredCelebrities(updatedCelebrities);
  };
  

  const saveChanges = (celebrityId) => {
    const updatedCelebrities = filteredCelebrities.map((celebrity) => {
      if (celebrity.id === celebrityId) {
        // Update the celebrity's information with the new values
        return {
          ...celebrity,
          first: celebrity.first, // Assuming you have firstName in your JSON
          age: celebrity.age,
          gender: celebrity.gender,
          country: celebrity.country,
          description: celebrity.description,
        };
      }
      return celebrity;
    });
  
    // Update both filteredCelebrities and celebrities state
    setFilteredCelebrities(updatedCelebrities);
    setEditableId(null); // Clear the editable state after saving changes
  };

  const cancelEdit = () => {
    setEditableId(null); // Clear the editable state when canceling edit
  };

  const findage=(dateOfBirth)=>{
    const dob = new Date(dateOfBirth);

    // Get the current date
    const currentDate = new Date();
  
    // Calculate the difference in years between the current date and date of birth
    let age = currentDate.getFullYear() - dob.getFullYear();
  
    // Check if the birthdate has occurred this year
    if (
      currentDate.getMonth() < dob.getMonth() ||
      (currentDate.getMonth() === dob.getMonth() && currentDate.getDate() < dob.getDate())
    ) {
      age--; // Subtract 1 if the birthday hasn't occurred yet this year
    }
  
    return age;
  }

  return (
    <div className="user-details">
      <input
        type="text"
        placeholder="Search by name"
        value={searchQuery}
        onChange={handleSearch}
        className="one"
      />

      <ul className="user-list">
        {filteredCelebrities.map((celebrity) => (
          <li key={celebrity.id} className="user-item">
            <img src={celebrity.picture} className='two'></img>
            
            <strong className='zero'>Name: {celebrity.first + " "+celebrity.last}</strong>
            <button onClick={() => toggleOpenClose(celebrity.id)} className='three'>
              {celebrity.isOpen ? '-' : '+'}
            </button>
            {celebrity.isOpen && (
              <>
                <br />
                <div className="user-details">
                <strong>Age:</strong> {findage(celebrity.dob)} <br />
                <strong>Gender:</strong> {celebrity.gender} <br />
                <strong>Country:</strong> {celebrity.country} <br />
                <strong>Description:</strong> {celebrity.description} <br />
                </div>
                {editableId === celebrity.id ? (
                  <>
                  <div className="user-edit"> 
                    <input
                    type="text"
                    value={celebrity.first + " "+celebrity.last}
                    onChange={(e) => handleInputChange(e, celebrity.id, 'first')}
                    />

                    <input
                    type="number"
                    value={findage(celebrity.dob)}
                    onChange={(e) => handleInputChange(e, celebrity.id, 'dob')}
                    />

                    <select
                    value={celebrity.gender}
                    onChange={(e) => handleInputChange(e, celebrity.id, 'gender')}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Transgender">Transgender</option>
                      <option value="Rather not say">Rather not say</option>
                      <option value="Other">Other</option>
                    </select>

                    <input
                    type="text"
                    value={celebrity.country}
                    onChange={(e) => handleInputChange(e, celebrity.id, 'country')}
                    />

                    <textarea
                    value={celebrity.description}
                    onChange={(e) => handleInputChange(e, celebrity.id, 'description')}
                    />
                    <button onClick={() => saveChanges(celebrity.id)}>Save</button>
                    <button onClick={cancelEdit}>Cancel</button>
                  </div>
                  </>
                ) : (
                  <div className="user-details">
                    <button onClick={() => handleEdit(celebrity.id)}>Edit</button>
                    <button onClick={() => handleDelete(celebrity.id)}>Delete</button>
                  </div>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
