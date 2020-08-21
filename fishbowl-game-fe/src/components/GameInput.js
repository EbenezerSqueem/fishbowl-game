import React from 'react';


const GameInput = ({ inputId, inputLabel, inputValue, changeAmount, lowerLimit, upperLimit, changeValue }) => {
    let activeMinus = inputValue > lowerLimit;
    let activePlus = inputValue < upperLimit;

    const displayLimitMsg = () => {
        console.log("Limit Reached");
    }
    return (
        <div className="game-input" id={inputId}>
            <span className="input-label">{inputLabel}</span>
            {
                !activeMinus
                && <div className="icon-container" onClick={displayLimitMsg}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon inactive-icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="#9E9E9E" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z"/>
                            <circle cx="12" cy="12" r="9" />
                            <line x1="9" y1="12" x2="15" y2="12" />
                        </svg>
                    </div>
            }
            {
                activeMinus
                && <div className="icon-container" onClick={() => changeValue(inputId, inputValue-changeAmount)}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon active-icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="#16697A" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z"/>
                            <circle cx="12" cy="12" r="9" />
                            <line x1="9" y1="12" x2="15" y2="12" />
                        </svg>
                    </div>
            }
            <div className="input-value">{inputValue}</div>
            {
                !activePlus
                && <div className="icon-container" onClick={displayLimitMsg}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon inactive-icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="#9E9E9E" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z"/>
                            <circle cx="12" cy="12" r="9" />
                            <line x1="9" y1="12" x2="15" y2="12" />
                            <line x1="12" y1="9" x2="12" y2="15" />
                        </svg>
                    </div>
            }
            {
                activePlus
                && <div className="icon-container" onClick={() => changeValue(inputId, inputValue+changeAmount)}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon active-icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="#16697A" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z"/>
                            <circle cx="12" cy="12" r="9" />
                            <line x1="9" y1="12" x2="15" y2="12" />
                            <line x1="12" y1="9" x2="12" y2="15" />
                        </svg>
                    </div>
            }
        </div>
    );
}

export default GameInput;