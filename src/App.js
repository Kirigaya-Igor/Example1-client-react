import React, {useEffect, useState, useContext} from 'react'
import './App.css';
import Client from "./components/client";
import io from "socket.io-client";
import ServerDataContext from './context/serverContext';

const SERVER_URL = 'http://localhost:20100'
export const APP_ID = 1
export const socket = io(SERVER_URL)
const testObj = {
  id: APP_ID,
  nameApp: 'Test-app',
  timestamp: Date.now()
}

function App() {
  const [appLoading, setAppLoading] = useState(false)
  const {serverData, setServerData} = useContext(ServerDataContext)

  useEffect(() => {
    setAppLoading(true)
    socket.emit("newSendOperation", JSON.stringify(testObj))

    socket.on("sendOperation", (data) => {
      const newData = JSON.parse(data)
      setServerData(newData)
      setAppLoading(false);
    })
  }, [])

  return (
      <div>
        {appLoading ? 'App loading, please wait...' : <Client serverData={serverData}/>}
      </div>
  )
}

export default App;
