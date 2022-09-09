import { Button, Stack, TextField } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateEnvironmentMutation } from './thunks/environments';

export function CreateNewEnvironment() {
    const [name, setName] = useState('');
    const [isProduction, setIsProduction] = useState(false);
    const [createEnvironment, { isLoading, isError }] = useCreateEnvironmentMutation();
    const navigate = useNavigate();

    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    }, []);

    const handleAddPost = () => {
        const call = async () => {
            try {
                await createEnvironment({ name, isProduction }).unwrap();
                navigate('/environments');
            } catch {
                console.log('Error occurred');
            }
        };
        call();
    };

    return (
        <div>
            <Stack>
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
            </Stack>
        </div>
    );
}
