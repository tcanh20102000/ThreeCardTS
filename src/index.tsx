import ReactDOM from "react-dom/client";
import React from "react";
import App from "./App";
import { PlayersProvider } from "./context/PlayersProvider";

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render( 
    <PlayersProvider>
        <App />
    </PlayersProvider>  
);

//ReactDOM.render(<App />, document.getElementById("root"));