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
import { DeployedApp, useGetPactDeployedOnEnvironmentQuery } from './thunks/environments';

export default function Deployed({ environmentId }: { environmentId: string }) {
    const {
        data: deployedApps,
        isError,
        isLoading,
        isSuccess,
    } = useGetPactDeployedOnEnvironmentQuery(environmentId);

    return (
        <div>
            {isError && <div>Error loading deployed</div>}
            {isLoading && <div>Loading deployed...</div>}
            {isSuccess && deployedApps !== undefined && (
                <DeployedAppsView deployedApps={deployedApps} />
            )}
        </div>
    );
}

function DeployedAppsView({ deployedApps }: { deployedApps: DeployedApp[] }) {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell align="right">Id</TableCell>
                        <TableCell align="right">Name&nbsp;(g)</TableCell>
                        <TableCell align="right">Version</TableCell>
                        <TableCell align="right">Link</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {deployedApps.map((row) => (
                        <TableRow
                            key={row.uuid}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.uuid}
                            </TableCell>
                            <TableCell align="right">{row.pacticipantName}</TableCell>
                            <TableCell align="right">{row.version}</TableCell>
                            <TableCell align="right">
                                <Link
                                    component={RouterLink}
                                    to={`/pacticipants/${row.pacticipantName}`}
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
