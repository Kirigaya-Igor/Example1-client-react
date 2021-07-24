import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ServerDataContext from './context/serverContext';

const Main = () => {
    const [serverData, setServerData] = useState({})
    return (
        <React.StrictMode>
            <ServerDataContext.Provider value = {{serverData, setServerData}}>
                <App />
            </ServerDataContext.Provider>
        </React.StrictMode>
    )
}

ReactDOM.render(<Main/>, document.getElementById('root'));

reportWebVitals();
