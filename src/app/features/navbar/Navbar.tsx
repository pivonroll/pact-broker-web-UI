import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/environments">Environments</Link>
                </li>
                <li>
                    <Link to="/pacticipants">Pacticipants</Link>
                </li>
                <li>
                    <Link to="/graph">Graph</Link>
                </li>
            </ul>
        </nav>
    );
}
