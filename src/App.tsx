import {useEffect, useState} from 'react'
import './App.css'

function App() {
  return (
    <>
        <TestComponent url="http://localhost:7070/data"></TestComponent>
        <TestComponent url="http://localhost:7070/error"></TestComponent>
        <TestComponent url="http://localhost:7070/loading"></TestComponent>
    </>
  )
}

export default App

type UseJsonFetchState = {
    data?: object,
    loading: boolean,
    error?: Error
}

function useJsonFetch(url: string): [(object | undefined), boolean, (Error | undefined)] {
    const [state, setState] = useState( {
        loading: true
    } as UseJsonFetchState);
    useEffect(() => {
        if (url) {
            fetch(url)
                .then(async r => {
                    if (!r.ok) {
                        throw new Error(r.statusText);
                    }
                    setState({...state, data: await r.json(), loading: false, error: undefined});
                })
                .catch(e => setState({...state, loading: false, error: e, data: undefined}));
        }
    }, [url]);
    return [state.data, state.loading, state.error];
}

type TestComponentProps = {
    url: string
}

function TestComponent(props: TestComponentProps) {
    const {url} = props;
    const [data, loading, error] = useJsonFetch(url);
    return loading
        ? (<div>Данные загружаются...</div>)
        : (!error ? (<div>{data + ""}</div>) : (<div>Ошибка: {error.message}</div>))
}