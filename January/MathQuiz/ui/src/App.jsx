import Question from "./Question";
import Input from "./Input";

function App() {
  return (
      <div className="App">
          <header>
              <div className="container">
                  <h1 className="text-center">Bienvenue dans ce quiz sur les mathématiques !</h1>
              </div>
          </header>
          <Question/>
          <Input/>
      </div>
  );
}

          export default App;
