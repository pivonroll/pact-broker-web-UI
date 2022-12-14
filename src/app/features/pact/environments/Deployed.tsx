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
                <div>
                    <Typography variant="h6" gutterBottom>
                        Deployed Applications
                    </Typography>
                    <DeployedAppsView deployedApps={deployedApps} />
                </div>
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
                        <TableCell align="left">Name</TableCell>
                        <TableCell align="center">Version</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {deployedApps.map((row) => (
                        <TableRow
                            key={row.uuid}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell align="left">
                                <Link
                                    component={RouterLink}
                                    to={`/pacticipants/${row.pacticipantName}`}
                                >
                                    {row.pacticipantName}
                                </Link>
                            </TableCell>
                            <TableCell align="center">{row.version}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
