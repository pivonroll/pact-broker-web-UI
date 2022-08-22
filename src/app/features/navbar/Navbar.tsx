import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';

export default function Navbar() {
    return (
        <nav>
            <ul>
                <li>
                    <Link component={RouterLink} to="/">
                        Home
                    </Link>
                </li>
                <li>
                    <Link component={RouterLink} to="/environments">
                        Environments
                    </Link>
                </li>
                <li>
                    <Link component={RouterLink} to="/pacticipants">
                        Pacticipants
                    </Link>
                </li>
                <li>
                    <Link component={RouterLink} to="/graph">
                        Graph
                    </Link>
                </li>
            </ul>
        </nav>
    );
}
