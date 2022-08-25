import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './features/dashboard/Dashboard';

function App() {
    return (
        <div>
            <BrowserRouter>
                <Dashboard></Dashboard>
            </BrowserRouter>
        </div>
    );
}

export default App;
