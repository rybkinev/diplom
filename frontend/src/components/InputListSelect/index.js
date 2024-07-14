import React, {useEffect, useState} from 'react';
import './index.css';
import api from "../../api";

const InputListSelect = ({url, valueName, valueInput, handleChange, name, id}) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [allSuggestions, setAllSuggestions] = useState([]);

  const [hasMatch, setHasMatch] = useState(true);

  const fetchModelList = async () => {

    await api.get(
      url,
    ).then((response) => {
      const result = response.data.results
      // console.debug('InputListSelect fetchModelList api.get', url, response.data)
      setAllSuggestions(result);
    }).catch((error) => {
      console.error('InputListSelect fetchModelList api.get error', error)
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
        value: { id: suggestion.id, [valueName]: suggestion[valueName] },
      },
    };

    // console.debug('InputListSelect handleSuggestionClick', suggestion);

    setInputValue(suggestion[valueName]);
    handleChange(artificialEvent);
    setFilteredSuggestions([]);
    setHasMatch(true);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;

    setInputValue(value);
    if (value) {
      const filtered = allSuggestions
        .filter(suggestion => suggestion[valueName].toLowerCase().includes(value.toLowerCase()))
        .slice(0, 10);
      setFilteredSuggestions(filtered);
      setHasMatch(filtered.length > 0);
    } else {
      setFilteredSuggestions([]);
      setHasMatch(true);
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
    <div className='input-list-search'>
      <input
        type="text"
        autoComplete="off"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        name={name}
        id={id}
        placeholder='Для поиска начните вводить'
        className={!hasMatch ? 'input-error' : ''}
      />
      {inputValue && (
        <ul>
          {filteredSuggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              onMouseDown={() => handleSuggestionClick(suggestion)}
            >
              {suggestion[valueName]}
            </li>
          ))}
        </ul>
      )}
    </div>

  );
};

export default InputListSelect;
