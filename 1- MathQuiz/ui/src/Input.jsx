import {useState} from "react";

function Input() {
    const [inputValue, setInputValue] = useState("");
    return <div className="input-group mb-3 container fixed-bottom">
        <input type="text" className="form-control" placeholder="Placer votre réponse ici" value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}/>
        <button className="btn btn-primary" type="button" id="" onClick={() => {alert(inputValue)}}>Valider</button>
    </div>
}

export default Input
