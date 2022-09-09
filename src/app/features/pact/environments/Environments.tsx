import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {
    Alert,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Link,
    Paper,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDeleteEnvironmentMutation, useGetPactEnvironmentsQuery } from './thunks/environments';

interface DeleteEnvironment {
    id: string;
    name: string;
}

export default function Environments() {
    const navigate = useNavigate();
    const { data: environments, isError, isLoading, isSuccess } = useGetPactEnvironmentsQuery('');
    const [deleteEnvironment, { isLoading: isDeleteProcessing, isError: isDeleteError }] =
        useDeleteEnvironmentMutation();
    const [isMessageShown, setIsMessageShown] = useState(false);
    const [environmentForDeletion, setEnvironmentForDeletion] = useState<
        DeleteEnvironment | undefined
    >();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleDelete = useCallback(
        ({ id, name }: DeleteEnvironment) => {
            const call = async () => {
                try {
                    console.log(`Delete: ${id}`);
                    await deleteEnvironment(id).unwrap();
                    setIsMessageShown(true);
                } catch {
                    console.log('Error occurred');
                }
            };
            call();
        },
        [deleteEnvironment]
    );

    const showDeleteDialog = useCallback((value: DeleteEnvironment) => {
        setEnvironmentForDeletion(value);
        setIsDialogOpen(true);
    }, []);

    const handleDialogClose = useCallback(() => {
        setIsDialogOpen(false);
        setEnvironmentForDeletion(undefined);
    }, []);

    const handleDeleteEnvironment = useCallback(() => {
        if (environmentForDeletion !== undefined) {
            handleDelete(environmentForDeletion);
            setIsDialogOpen(false);
        }
    }, [environmentForDeletion, handleDelete]);

    const handleMessageClose = useCallback(() => {
        setIsMessageShown(false);
    }, []);

    const action = useMemo(
        () => (
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleMessageClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        ),
        [handleMessageClose]
    );

    return (
        <div>
            <Button
                sx={{ marginBottom: 2 }}
                variant="contained"
                onClick={() => navigate('/environments/create-new')}
            >
                New Environment
            </Button>
            <Typography variant="h5" sx={{ pb: 4 }}>
                Environments
            </Typography>
            {isError && <div>Error while loading environments</div>}
            {isLoading && <div>Loading environments...</div>}
            {isSuccess && environments !== undefined && (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">Name</TableCell>
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {environments.map((row) => (
                                <TableRow
                                    key={row.uuid}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell align="left">
                                        <Link
                                            component={RouterLink}
                                            to={`/environments/${row.uuid}`}
                                        >
                                            {row.displayName}
                                        </Link>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button
                                            onClick={() =>
                                                showDeleteDialog({
                                                    id: row.uuid,
                                                    name: row.displayName,
                                                })
                                            }
                                        >
                                            <DeleteOutlineIcon />
                                        </Button>
                                        {isDeleteProcessing && <CircularProgress />}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            <Snackbar
                open={isMessageShown}
                autoHideDuration={6000}
                onClose={handleMessageClose}
                action={action}
            >
                <Alert
                    variant="filled"
                    onClose={handleMessageClose}
                    severity={isDeleteError ? 'error' : 'success'}
                    sx={{ width: '100%' }}
                >
                    {isDeleteError
                        ? `Failed to delete ${environmentForDeletion?.name}`
                        : `${environmentForDeletion?.name} Deleted`}
                </Alert>
            </Snackbar>
            <Dialog
                onClose={handleDialogClose}
                open={isDialogOpen}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle>Delete {environmentForDeletion?.name}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete environment {environmentForDeletion?.name}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ marginBottom: 2, marginRight: 2 }}>
                    <Button
                        variant="contained"
                        startIcon={<DeleteIcon />}
                        onClick={handleDeleteEnvironment}
                    >
                        Delete
                    </Button>
                    <Button variant="text" onClick={handleDialogClose}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
