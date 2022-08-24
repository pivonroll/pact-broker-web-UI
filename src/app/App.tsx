import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import ResponsiveDrawer from './features/dashboard/Dashboard';

function App() {
    return (
        <div>
            <BrowserRouter>
                <ResponsiveDrawer></ResponsiveDrawer>
            </BrowserRouter>
        </div>
    );
}

export default App;
