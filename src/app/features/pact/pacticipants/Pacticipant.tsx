import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import React, { useCallback, useState } from 'react';
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
    const [detailsExpanded, setDetailsExpanded] = useState(true);
    const { data: pacticipant, isError, isLoading, isSuccess } = useGetPacticipantByNameQuery(name);
    return (
        <div>
            <Typography>Pacticipant</Typography>
            {isError && <div>Error loading pacticipant</div>}
            {isLoading && <div>Loading pacticipant...</div>}
            {isSuccess && (
                <div>
                    <Box sx={{ pt: 0.5, pb: 0.5 }}>
                        <Accordion
                            expanded={detailsExpanded}
                            onChange={() => {
                                setDetailsExpanded(!detailsExpanded);
                            }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Details</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>Name: {pacticipant.displayName}</Typography>
                                <Typography>Main Branch: {pacticipant.mainBranch}</Typography>
                                <Typography>Latest Version: {pacticipant.latestVersion}</Typography>
                            </AccordionDetails>
                        </Accordion>
                    </Box>
                    <Box sx={{ pt: 0.5, pb: 0.5 }}>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Versions</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <PacticipantVersions name={name} />
                            </AccordionDetails>
                        </Accordion>
                    </Box>
                    <Box sx={{ pt: 0.5, pb: 1 }}>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Group</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <PacticipantGroup name={name} />
                            </AccordionDetails>
                        </Accordion>
                    </Box>
                </div>
            )}
        </div>
    );
}

function PacticipantVersions({ name }: { name: string }) {
    const { data: versions, isError, isLoading, isSuccess } = useGetPacticipantVersionsQuery(name);

    const renderVersions = useCallback(() => {
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
                                    <TableCell align="center">{row.createdAt}</TableCell>
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
            {isSuccess && <div>{renderVersions()}</div>}
        </div>
    );
}

function PacticipantGroup({ name }: { name: string }) {
    const { data: group, isError, isLoading, isSuccess, error } = useGetPacticipantGroupQuery(name);

    const constructNodes = useCallback((): NodeData[] => {
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

    const constructEdges = useCallback((): EdgeData[] => {
        if (group !== undefined) {
            const edges: EdgeData[] = [];
            group.forEach((item) => {
                if (item.target !== undefined) {
                    edges.push({
                        id: item.id + '-' + item.target,
                        from: item.id,
                        to: item.target,
                    });
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
            <Canvas
                maxWidth={800}
                maxHeight={400}
                nodes={constructNodes()}
                edges={constructEdges()}
            />
        </div>
    );
}
