import React, {useState, useEffect, useContext} from 'react'
import {APP_ID, socket} from "../App";
import ServerDataContext from "../context/serverContext";

const WYBIERZ = 'Wybierz'

const Client = () => {
    const [login, setLogin] = useState('')
    const [firstSelect, setFirstSelect] = useState(WYBIERZ)
    const [secondSelect, setSecondSelect] = useState(WYBIERZ)
    const [thirdSelect, setThirdSelect] = useState(WYBIERZ)
    const [isButtonActive, setIsButtonActive] = useState(false)
    const [data, setData] = useState([])

    const {serverData: {logoUrl, appName, timeDifference}} = useContext(ServerDataContext)

    const textChange = (e) => {
        setLogin(e.currentTarget.value.replace(/\s+/g,''))
    }

    const formSubmit = (e) => {
        e.preventDefault()

        setData([...data, {login, firstSelect, secondSelect, thirdSelect}])

        const textInputData = {data: [login]}
        const selectInputData = {data: [firstSelect, secondSelect, thirdSelect]}

        const clientObj = {
            appHashName: appName,
            appId: APP_ID,
            clientTime: Date.now() - timeDifference,
            formData: [textInputData, selectInputData]
        }

        socket.emit("formDataSend", JSON.stringify(clientObj))

        setLogin('')
        setFirstSelect(WYBIERZ)
        setSecondSelect(WYBIERZ)
        setThirdSelect(WYBIERZ)

        console.log(`${login} ${firstSelect} ${secondSelect} ${thirdSelect}`)

        setIsButtonActive(false)
    }

    useEffect(() => {
        if(login !== '' && firstSelect !== WYBIERZ && secondSelect !== WYBIERZ && thirdSelect !== WYBIERZ){
            setIsButtonActive(true)
        } else{
            setIsButtonActive(false)
        }
    }, [login, firstSelect, secondSelect, thirdSelect])

    return (
        <>
            <div>
                <nav className="navbar navbar-dark bg-dark">
                    <div className='container-fluid'>
                        <img src={logoUrl} height="50" alt='LOGO'/>
                        <div>
                            <HeaderData title='hash nazwy apliakcji' content={appName}/>
                            <HeaderData title='address logo' content={logoUrl}/>
                            <HeaderData title='różnica czasu' content={timeDifference}/>
                        </div>

                    </div>
                </nav>
            </div>

            <div className='container-fluid'>
                <div className='row'>
                    <div className='d-flex justify-content-around'>
                        <div className='col-6'>
                            <form onSubmit={formSubmit} className='d-flex flex-column m-5'>
                                <div className="mb-3">
                                    <label htmlFor="textInput" className="form-label">Podaj login (bez spacji)</label>
                                    <input type="text" id="textInput" className="form-control"
                                           value={login}
                                           placeholder="Login" onChange={textChange}/>
                                </div>
                                <SelectForm selectFormId='firstSelect' selectFormTitle='Wybierz miasto'
                                            selectChange={(e) => setFirstSelect(e.currentTarget.value)}
                                            selectDefaultValue={firstSelect}
                                            items={['Warszawa', 'Wroclaw', 'Kraków', 'Lublin']}/>

                                <SelectForm selectFormId='secondSelect' selectFormTitle='Stanowisko'
                                            selectChange={(e) => setSecondSelect(e.currentTarget.value)}
                                            selectDefaultValue={secondSelect}
                                            items={['Frontend', 'Backend', 'Tester', 'Project manager']}/>

                                <SelectForm selectFormId='thirdSelect' selectFormTitle='Wybierz poziom stanowiska'
                                            selectChange={(e) => setThirdSelect(e.currentTarget.value)}
                                            selectDefaultValue={thirdSelect}
                                            items={['Stażysta', 'Junior', 'Middle', 'Senior']}/>

                                <SubmitButton isButtonActive={isButtonActive}/>
                            </form>
                        </div>

                        <div className='col-6'>
                            <div className='m-5'>
                                {data.map(item => (
                                    <DataItem  key={item.login + Date.now()} login={item.login}
                                               firstSelect={item.firstSelect}
                                               secondSelect={item.secondSelect}
                                               thirdSelect={item.thirdSelect}/>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

const HeaderData = ({title, content}) => {
    return (
        <div className='text-white'>
            {title}: {content}
        </div>
    )
}

const SelectForm = ({selectFormId, selectFormTitle, selectChange, selectDefaultValue, items}) => {
    return (
        <div className="mb-3">
            <label htmlFor={selectFormId} className="form-label">{selectFormTitle}</label>
            <select id={selectFormId} className="form-select" onChange={selectChange} value={selectDefaultValue}>
                <option disabled>{WYBIERZ}</option>
                {items.map(item => (
                    <option key={item}>{item}</option>
                ))}
            </select>
        </div>
    )
}

const SubmitButton = ({isButtonActive}) => {
    return (
        <>
            {isButtonActive ? <button type="submit" className="btn btn-success" >Send Data</button>
                : <button type="submit" className="btn btn-success" disabled>Send Data</button>
            }
        </>
    )
}

const DataItem = ({key, login, firstSelect, secondSelect, thirdSelect}) => {
    return (
        <p key={key} className='border-dark border-bottom'>
            <b>Login: </b> {login}; <br/>
            <b>Miasto: </b> {firstSelect}; <br/>
            <b>Stanowisko: </b> {secondSelect}; <br/>
            <b>Poziom Stanowiska: </b> {thirdSelect};
        </p>
    )
}

export default Client