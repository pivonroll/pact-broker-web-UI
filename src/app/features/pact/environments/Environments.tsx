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
import { ResponseEnvironment, useGetPactEnvironmentsQuery } from './thunks/environments';

export default function Environments() {
    const { data: environments, isError, isLoading, isSuccess } = useGetPactEnvironmentsQuery('');

    return (
        <div>
            <div>Environments</div>
            {isError && <div>Error while loading environments</div>}
            {isLoading && <div>Loading environments...</div>}
            {isSuccess && environments !== undefined && (
                <EnvironmentsView environments={environments} />
            )}
        </div>
    );
}

function EnvironmentsView({ environments }: { environments: ResponseEnvironment[] }) {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell align="left">Id</TableCell>
                        <TableCell align="center">Name</TableCell>
                        <TableCell align="center">Link</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {environments.map((row) => (
                        <TableRow
                            key={row.uuid}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell align="left">{row.uuid}</TableCell>
                            <TableCell align="center">{row.displayName}</TableCell>
                            <TableCell align="center">
                                <Link component={RouterLink} to={`/environments/${row.uuid}`}>
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
