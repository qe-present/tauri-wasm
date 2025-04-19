import "./App.css";
import {useEffect} from "react";
import init,{change_theme} from "../src-wasm/window/pkg";

function App() {
    useEffect(() => {
        init()
    }, []);

    async function handlClick() {
        // await getTitle()
        await change_theme();

    }

    return (
        <>
            <header>
                <h1>Welcome to Tauri + React</h1>
            </header>
            <main className="container">
                <button onClick={handlClick}>确定</button>
            </main>
        </>
    );
}

export default App;
