import { useQuery } from "@tanstack/react-query";
import {useState} from "react";
import React from "react";

const API_URL = 'http://127.0.0.1:8000/api';

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
    return response.json();
}


async function VerifyAnswer(question_data, inputValue) {
    const payload = {
        question: question_data.question,
        answer: question_data.answer, // Réponse saisie par l'utilisateur
        others_answers: question_data.others_answers,
        subject: question_data.subject,
        response_type: question_data.response_type,
    };
    const response = await fetch(`${API_URL}/verify?answer=${inputValue}`,{
        body: JSON.stringify(payload),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: "POST"
    });

    if (!response.ok) {
        throw new Error(await response.text()); // Affiche le message d'erreur exact de l'API
    }
    return response.json();
}



function QuestionResponse() {
    const { data, isError, isLoading } = useQuery(['generate'], fetchData);
    const [inputValue, setInputValue] = useState("");

    const [isCorrect, setIsCorrect] = useState(false);

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error fetching data</div>;


    return (
        <div className="container">
            <div className="card text-bg-info mb-3">
                <div className="card-header">{data.subject}</div>
                <div className="card-body">
                    <p className="card-text">{data.question}</p>
                </div>
            </div>
            { isCorrect ? <p>None</p> : <p>Oui</p>}
            <div>

            </div>
            <div className="input-group mb-3 container fixed-bottom">
                <input type="text" className="form-control" placeholder="Placer votre réponse ici" value={inputValue}
                       onChange={(e) => setInputValue(e.target.value)}/>
                <button className="btn btn-primary" type="button"
                        onClick={async () => setIsCorrect(await VerifyAnswer(data, inputValue))}>
                    Valider
                </button>
            </div>
        </div>
    );
}

export default QuestionResponse;
