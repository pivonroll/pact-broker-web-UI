import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
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
                        <TableCell align="right">Name&nbsp;(g)</TableCell>
                        <TableCell align="right">Main Branch</TableCell>
                        <TableCell align="right">Latest Version</TableCell>
                        <TableCell align="right">Link</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {pacticipants.map((row) => (
                        <TableRow
                            key={row.name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.displayName}
                            </TableCell>
                            <TableCell align="right">{row.mainBranch}</TableCell>
                            <TableCell align="right">{row.latestVersion ?? ''}</TableCell>
                            <TableCell align="right">
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
