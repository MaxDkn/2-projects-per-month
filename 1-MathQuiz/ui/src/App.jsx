import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

const API_URL = 'http://127.0.0.1:8000/api';

const shuffleArray = (array) => {
    let shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Échange
    }
    return shuffledArray;
};

async function fetchData() {
    const response = await fetch(`${API_URL}/generate`, {
        body: JSON.stringify({}),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: "POST"
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();

    const transformedAnswers = data.suggested_answer.map((answer) => {
        return answer === true ? "Oui" : answer === false ? "Non" : answer;
    });

    return { ...data, suggested_answer: transformedAnswers};
}

const colors = ['#CEE5D0', '#F3F0D7', '#FED2AA', '#F0C1E1'];

function App() {
    const {data, isError, isLoading, refetch} = useQuery(['generate'], fetchData);
    const [shuffledColors, setShuffledColors] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');

    function validAnswer(index) {
        if (index !== data.index_answer) {
            setPopupMessage(`Vous vous êtes trompé, la bonne réponse était ${data.suggested_answer[data.index_answer]}`);
            setShowPopup(true);
        }
        refetch();
    }

    const closePopup = () => {
        setShowPopup(false);
    };

    useEffect(() => {
        setShuffledColors(shuffleArray(colors));
    }, [data]);

    if (isError) {
        return (
            <div className="container">
                <div className="alert alert-danger container" role="alert">
                    Erreur dans la récupération des données, l'API n'est pas connecté au frontend.
                </div>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <div className="spinner-border" role="status" />
            </div>
        );
    }

    return (
        <div className="App container">
            <div className="text-center"
                 style={{
                     border: "2px solid black",
                     padding: "10px",
                     margin: "10px",
                     fontSize: "1.7rem",
                     fontWeight: "bold",
                     backgroundColor: "#f9f9f9",
                 }}>
                {data.question}
            </div>

            <div className="container d-flex flex-column justify-content-between" style={{ height: "calc(75vh)", marginTop: "20px" }}>
                {data.suggested_answer.map((item, index) => (
                    index % 2 === 0 ? (
                        <div className="row flex-grow-1" key={index}>
                            <div className="col p-2">
                                <button
                                    className="btn w-100 h-100"
                                    onClick={() => {validAnswer(index)}}
                                    style={{
                                        backgroundColor: shuffledColors[index % shuffledColors.length],
                                        fontSize: "2rem",

                                    }}
                                >
                                    {item}
                                </button>
                            </div>
                            {data.suggested_answer[index + 1] && (
                                <div className="col p-2">
                                    <button
                                        className="btn w-100 h-100"
                                        onClick={() => {validAnswer(index + 1)}}
                                        style={{
                                            backgroundColor: shuffledColors[(index + 1) % shuffledColors.length],
                                            fontSize: "2rem",
                                        }}
                                    >
                                        {data.suggested_answer[index + 1]}
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : null
                ))}
            </div>

            {/* Modal Popup */}
            {showPopup && (
                <div className="modal show" style={{ display: "block" }} tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Erreur de Réponse</h5>
                                <button type="button" className="close" onClick={closePopup}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>{popupMessage}</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closePopup}>Fermer</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
