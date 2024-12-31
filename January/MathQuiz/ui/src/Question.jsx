import { useQuery } from "@tanstack/react-query";
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

function Question() {
    const { data, isError, isLoading } = useQuery(['generate'], fetchData);

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error fetching data</div>;

    return (
        <div className="card text-bg-info mb-3 container">
            <div className="card-header">{data.subject}</div>
            <div className="card-body">
                <p className="card-text">{data.question}</p>
            </div>
        </div>
    );
}

export default Question;
