import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ResponseEnvironment, useGetPactEnvironmentsQuery } from './thunks/environments';

export default function Environments() {
    const { data: environments, isError, isLoading, isSuccess } = useGetPactEnvironmentsQuery('');

    return (
        <div>
            <Typography variant="h5" sx={{ pb: 4 }}>
                Environments
            </Typography>
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
                        <TableCell align="left">Name</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {environments.map((row) => (
                        <TableRow
                            key={row.uuid}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell align="left">
                                <Link component={RouterLink} to={`/environments/${row.uuid}`}>
                                    {row.displayName}
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
