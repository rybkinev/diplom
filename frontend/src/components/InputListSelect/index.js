import React, {useEffect, useState} from 'react';
import api from "../../api";

const InputListSelect = ({url, valueName, valueInput, handleChange, name}) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [allSuggestions, setAllSuggestions] = useState([]);

  const fetchModelList = async () => {

    await api.get(
      url,
    ).then((response) => {
      const result = response.data.results
      console.debug('InputListSelect fetchModelList api.get', response.data)
      setAllSuggestions(result);
    }).catch((error) => {
      console.debug('InputListSelect fetchModelList api.get error', error)
    });
  }

  useEffect(() => {
    fetchModelList();
  }, []);

  useEffect(() => {
    if (valueInput) {
      setInputValue(valueInput);
    }
  }, [valueInput]);

  const handleSuggestionClick = (suggestion) => {
    const artificialEvent = {
      target: {
        name: name,
        value: { id: suggestion.id, name: suggestion.name },
      },
    };

    // console.debug('InputListSelect handleSuggestionClick', suggestion);

    setInputValue(suggestion.name);
    handleChange(artificialEvent);
    setFilteredSuggestions([]);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (value) {
      const filtered = allSuggestions
        .filter(suggestion =>
          suggestion[valueName].toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 10);
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  };

  const handleBlur = () => {
    setFilteredSuggestions([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && filteredSuggestions.length === 1) {
      handleSuggestionClick(filteredSuggestions[0]);
    }
  };

  return (
    <div style={{position: 'relative', width: '200px'}}>
      <input
        type="text"
        autoComplete="off"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        name={name}

      />
      {inputValue && (
        <ul style={{
          position: 'absolute',
          border: '1px solid #ddd',
          maxHeight: '150px',
          overflow: 'auto',
          width: '100%',
          backgroundColor: 'white',
          listStyleType: 'none',
          padding: 0,
          margin: 0,
        }}>
          {filteredSuggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              style={{padding: '5px 10px', cursor: 'pointer'}}
              onMouseDown={() => handleSuggestionClick(suggestion)}>
            >
              {suggestion.name}
            </li>
          ))}
        </ul>
      )}
    </div>

  );
};

export default InputListSelect;
