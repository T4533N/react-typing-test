import React, { useState } from 'react';
import logo from './logo.svg';
import useKeyPress from './hooks/useKeyPress';
import { generate } from './utils/words';
import { currentTime } from './utils/time';
import { useMediaQuery } from 'react-responsive';

import './App.css';

const initialWords = generate();

function App() {
  const isTab = useMediaQuery({ query: '(max-width: 600px)' });

  const [leftPadding, setLeftPadding] = useState(
    new Array(20).fill(' ').join(''),
  );
  const [outgoingChars, setOutgoingChars] = useState('');
  const [currentChar, setCurrentChar] = useState(initialWords.charAt(0));
  const [incorrect, setIncorrect] = useState(false);
  const [errors, setErrors] = useState(0);
  const [incomingChars, setIncomingChars] = useState(initialWords.substr(1));

  const [startTime, setStartTime] = useState();
  const [wordCount, setWordCount] = useState(0);
  console.log(wordCount);
  const [wpm, setWpm] = useState(0);

  const [accuracy, setAccuracy] = useState(0);
  const [typedChars, setTypedChars] = useState('');

  useKeyPress((key) => {
    if (!startTime) {
      setStartTime(currentTime());
    }

    let updatedOutgoingChars = outgoingChars;
    let updatedIncomingChars = incomingChars;
    if (key === currentChar) {
      setIncorrect(false);
      if (leftPadding.length > 0) {
        setLeftPadding(leftPadding.substring(1));
      }
      updatedOutgoingChars += currentChar;
      setOutgoingChars(updatedOutgoingChars);

      setCurrentChar(incomingChars.charAt(0));

      updatedIncomingChars = incomingChars.substring(1);
      if (updatedIncomingChars.split(' ').length < 10) {
        updatedIncomingChars += ' ' + generate();
      }
      setIncomingChars(updatedIncomingChars);

      if (incomingChars.charAt(0) === ' ') {
        setWordCount(wordCount + 1);
        const durationInMinutes = (currentTime() - startTime) / 60000.0;
        setWpm(((wordCount + 1) / durationInMinutes).toFixed(2));
      }
    } else {
      setErrors((r) => r + 1);
      setIncorrect(true);
    }

    const updatedTypedChars = typedChars + key;
    setTypedChars(updatedTypedChars);
    setAccuracy(
      ((updatedOutgoingChars.length * 100) / updatedTypedChars.length).toFixed(
        2,
      ),
    );
  });

  if (isTab) {
    return <div className="Tab">Isn't supported for mobile devices.</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p className="Character">
          <span className="Character-out">
            {(leftPadding + outgoingChars).slice(-20)}
          </span>
          <span
            className={`Character-current ${
              incorrect && 'Incorrect-character'
            }`}
          >
            {currentChar}
          </span>
          <span>{incomingChars.substr(0, 20)}</span>
        </p>
        <h3>
          WPM: {wpm} | ACC: {accuracy}% | Err:{' '}
          <span className={incorrect && 'error-animation'}>{errors}</span> |
          CPM: {outgoingChars.length} | Words: {wordCount}
        </h3>
        <span>
          <a
            className="App-link"
            href="https://github.com/taingmeng/typing-frenzy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Github
          </a>
        </span>
      </header>
    </div>
  );
}

export default App;
