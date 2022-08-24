import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Pacticipant, useGetPacticipantsQuery } from './pacticipantsApi';

export default function Pacticipants() {
    const { data: pacticipants, isError, isLoading, isSuccess } = useGetPacticipantsQuery('');

    return (
        <div>
            <div>Pacticipants</div>
            {isError && <div>Error loading pacticipants</div>}
            {isLoading && <div>Loading pacticipants...</div>}
            {isSuccess && pacticipants !== undefined && (
                <PacticipantsView pacticipants={pacticipants} />
            )}
        </div>
    );
}

function PacticipantsView({ pacticipants }: { pacticipants: Pacticipant[] }) {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell align="left">Name</TableCell>
                        <TableCell align="center">Main Branch</TableCell>
                        <TableCell align="center">Latest Version</TableCell>
                        <TableCell align="center">Link</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {pacticipants.map((row) => (
                        <TableRow
                            key={row.name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell align="left">{row.displayName}</TableCell>
                            <TableCell align="center">{row.mainBranch}</TableCell>
                            <TableCell align="center">{row.latestVersion ?? ''}</TableCell>
                            <TableCell align="center">
                                <Link component={RouterLink} to={`/pacticipants/${row.name}`}>
                                    Go
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
