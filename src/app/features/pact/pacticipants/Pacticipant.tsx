import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns';
import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Canvas, EdgeData, NodeData } from 'reaflow';
import {
    useGetPacticipantByNameQuery,
    useGetPacticipantGroupQuery,
    useGetPacticipantVersionsQuery,
} from './pacticipantsApi';

export default function Pacticipant() {
    const { pacticipantName } = useParams();
    return (
        <div>
            {pacticipantName === undefined && <div>Name is undefined</div>}
            {pacticipantName !== undefined && <PacticipantView name={pacticipantName} />}
        </div>
    );
}

function PacticipantView({ name }: { name: string }) {
    const { data: pacticipant, isError, isLoading, isSuccess } = useGetPacticipantByNameQuery(name);
    return (
        <div>
            {isError && <div>Error loading pacticipant</div>}
            {isLoading && <div>Loading pacticipant...</div>}
            {isSuccess && (
                <div>
                    <Box sx={{ pt: 0.5, pb: 0.5 }}>
                        <Typography pb={4} variant="h5" sx={{ fontWeight: 'bold' }}>
                            {pacticipant.displayName}
                        </Typography>
                        <Typography>Main Branch</Typography>
                        <Typography pb={2} variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {pacticipant.mainBranch || 'N/A'}
                        </Typography>
                        <Typography>Latest Version</Typography>
                        <Typography pb={4} variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {pacticipant.latestVersion}
                        </Typography>
                        <Box pb={2}>
                            <PacticipantVersions name={name} />
                        </Box>
                        <Box pb={2}>
                            <PacticipantGroup name={name} />
                        </Box>
                    </Box>
                </div>
            )}
        </div>
    );
}

function PacticipantVersions({ name }: { name: string }) {
    const { data: versions, isError, isLoading, isSuccess } = useGetPacticipantVersionsQuery(name);

    const versionsView = useMemo(() => {
        if (versions !== undefined) {
            return (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">Version Number</TableCell>
                                <TableCell align="center">Created At</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {versions.map((row) => (
                                <TableRow
                                    key={row.versionNumber}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell align="left">{row.versionNumber}</TableCell>
                                    <TableCell align="center">
                                        {format(new Date(row.createdAt), 'yyyy-MM-dd HH:mm')}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            );
        }

        return null;
    }, [versions]);

    return (
        <div>
            {isError && <div>Error loading pacticipant versions</div>}
            {isLoading && <div>Loading pacticipant versions...</div>}
            {isSuccess && <div>{versionsView}</div>}
        </div>
    );
}

function PacticipantGroup({ name }: { name: string }) {
    const { data: group, isError, isLoading } = useGetPacticipantGroupQuery(name);

    const nodes = useMemo((): NodeData[] => {
        if (group !== undefined) {
            return group.map((item) => {
                return {
                    id: item.id,
                    text: item.name,
                    disabled: true,
                };
            });
        }

        return [];
    }, [group]);

    const edges = useMemo((): EdgeData[] => {
        if (group !== undefined) {
            const edges: EdgeData[] = [];
            group.forEach((item) => {
                if (item.target !== undefined) {
                    edges.push({
                        id: item.id + '-' + item.target,
                        from: item.id,
                        to: item.target,
                    });
                    // just to demonstrate cyclic dependency
                    // edges.push({
                    //     id: item.id + '-' + item.target + '1',
                    //     from: item.target,
                    //     to: item.id,
                    // });
                }
            });
            return edges;
        }

        return [];
    }, [group]);

    return (
        <div>
            {isError && <div>Error loading pacticipant group</div>}
            {isLoading && <div>Loading pacticipant group...</div>}
            <Canvas maxWidth={800} maxHeight={400} nodes={nodes} edges={edges} />
        </div>
    );
}
