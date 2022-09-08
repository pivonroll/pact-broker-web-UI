import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
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
import { CanIDeploy as CanIDeployInterface, useCanIDeployQuery } from './canIDeployApi';

export function CanIDeploy() {
    const { data, isLoading, isSuccess, isError } = useCanIDeployQuery({
        environment: 'staging',
        pacticipantName: 'Rater',
        pacticipantVersion: '1.0.0',
    });

    console.log(data);

    return (
        <div>
            {isError && <div>Error sending a request</div>}
            {isLoading && <div>Loading pacticipants...</div>}
            {isSuccess && data !== undefined && <CanIDeployView {...data} />}
        </div>
    );
}

function CanIDeployView({ summary, matrix }: CanIDeployInterface) {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell align="left">Consumer Name (Version)</TableCell>
                        <TableCell align="left">Provider Name (Version)</TableCell>
                        <TableCell align="center" sx={{ width: '10%' }}>
                            Status
                        </TableCell>
                        <TableCell align="center" sx={{ width: '15%' }}>
                            Verification Result
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {matrix.map((row) => (
                        <TableRow
                            key={
                                row.consumer.name +
                                row.consumer.version +
                                row.provider.name +
                                row.provider.version
                            }
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell align="left">
                                {row.consumer.name} ({row.consumer.version.number})
                            </TableCell>
                            <TableCell align="left">
                                {row.provider.name} ({row.provider.version.number})
                            </TableCell>
                            <TableCell align="center">
                                {row.verificationResult.success ? (
                                    <CheckCircleIcon sx={{ color: 'success.main' }} />
                                ) : (
                                    <ErrorOutlineIcon sx={{ color: 'error.main' }} />
                                )}
                            </TableCell>
                            <TableCell align="center">
                                <Link
                                    component={RouterLink}
                                    to={`/can-i-deploy/consumer/${row.verificationResult.consumerName}/provider/${row.verificationResult.providerName}/pact/${row.verificationResult.pactVersion}/metadata/${row.verificationResult.metadata}`}
                                >
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
