import React, { useState } from 'react';
import './Landing.css';
import './Chatbox.css';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import {ProgressBar} from 'react-loader-spinner'

// response struct:

const QueryInput = (pdfLoading) => {
    const [query, setQuery] = useState('');
    const [responses, setResponses] = useState([]);
    const [responseLoading, setResponseLoading] = useState(false);
    const processQuery = async (query) => {
        const newEntry = {
            query: query,
            answer: '',
        }
        setResponses(responses => [newEntry, ...responses]);
        try {
            setResponseLoading(true);
            const response = await fetch('http://127.0.0.1:5000/api/query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain'
                },
                body: query,
            });

            const answer = await response.json();
            setResponses(responses => {
                const updatedResponses = [...responses];
                updatedResponses[0].answer = answer.text; 
                setResponseLoading(false);
                return updatedResponses;
            });
        } catch(error) {
            console.error("Error processing the query:", error);
        }
    };



    const handleSubmit = (e) => {
        e.preventDefault();
        processQuery(query);
        setQuery('')
    };
    //TODO: make responses its own component
    return (
        <>
            <form className="query-input-form" onSubmit={handleSubmit}>
                <div className="query-input-ctr">
                    <input
                        className="query-input-field"
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Enter your query"
                        disabled={responseLoading}
                    />
                    <IconButton type="submit" className="query-submit-button" disabled={responseLoading}>
                        <SendIcon />
                    </IconButton>
                </div>
            </form>
            <div className="responses">
                {responses.map((item, index) => (
                    <div className="response-bubble" key={index}>
                        <p id="response-bubble-query">
                            <span className="response-bubble-title">You asked: </span>
                            {item.query}
                        </p>
                        <p>
                            <span className="response-bubble-title">Answer: </span>
                            {item.answer ? item.answer : 
                            <ProgressBar
                                height="40"
                                width="40"
                                ariaLabel="progress-bar-loading"
                                wrapperStyle={{}}
                                wrapperClass="progress-bar-wrapper"
                                borderColor = 'black'
                                barColor = 'gray'
                            />}
                        </p>
                    </div>
                ))
                }
            </div>
        </>
    );
};

export default QueryInput;
