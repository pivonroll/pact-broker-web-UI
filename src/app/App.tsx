import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Graph from './features/graph_example/example';
import Navbar from './features/navbar/Navbar';
import Environment from './features/pact/environments/Environment';
import Environments from './features/pact/environments/Environments';
import Pacticipant from './features/pact/pacticipants/Pacticipant';
import Pacticipants from './features/pact/pacticipants/Pacticipants';

function App() {
    return (
        <div>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path="/" element={<div>Home</div>}></Route>
                    <Route path="environments">
                        <Route path="" element={<Environments />}></Route>
                        <Route path=":environmentId" element={<Environment />}></Route>
                    </Route>
                    <Route path="pacticipants">
                        <Route path="" element={<Pacticipants />}></Route>
                        <Route path=":pacticipantName" element={<Pacticipant />}></Route>
                    </Route>
                    <Route path="graph" element={<Graph></Graph>}></Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
