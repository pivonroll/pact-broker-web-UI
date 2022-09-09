import { Button, Stack, TextField, Typography } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import React, { useCallback, useState } from 'react';
import { CreateEnvironment, useCreateEnvironmentMutation } from './thunks/environments';

export function CreateNewEnvironment() {
    const [name, setName] = useState('');
    const [environment, setEnvironment] = useState<CreateEnvironment | undefined>(undefined);
    const [isProduction, setIsProduction] = useState(false);
    const [createEnvironment, { isLoading, isError, isSuccess }] = useCreateEnvironmentMutation();

    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    }, []);

    const handleAddPost = () => {
        const call = async () => {
            try {
                const response = await createEnvironment({ name, isProduction }).unwrap();
                setEnvironment(response);
            } catch {
                console.log('Error occurred');
            }
        };
        call();
    };

    return (
        <div>
            <Stack>
                <Typography>Name</Typography>
                <TextField
                    id="environment-name"
                    label="Environment Name"
                    variant="outlined"
                    value={name}
                    onChange={handleChange}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            value={isProduction}
                            onChange={() => setIsProduction(!isProduction)}
                        />
                    }
                    label="Is Production"
                />
                <Button variant="contained" sx={{ maxWidth: '15%' }} onClick={handleAddPost}>
                    Create
                </Button>
                {isLoading && <div>Creating {name}</div>}
                {isError && <div>Error creating {name}</div>}
                {isSuccess && environment && (
                    <div>
                        <div>{environment.uuid}</div>
                        <div>{environment.name}</div>
                        <div>{environment.displayName}</div>
                        <div>{environment.production}</div>
                        <div>{environment.createdAt}</div>
                    </div>
                )}
            </Stack>
        </div>
    );
}
