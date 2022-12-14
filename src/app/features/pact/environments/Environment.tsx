import Typography from '@mui/material/Typography';
import React from 'react';
import { useParams } from 'react-router-dom';
import Deployed from './Deployed';
import { useGetPactEnvironmentQuery } from './thunks/environments';

export default function Environment() {
    const { environmentId } = useParams();

    return (
        <div>
            {environmentId === undefined && <div>Id is undefined</div>}
            {environmentId !== undefined && <EnvironmentDisplay id={environmentId} />}
        </div>
    );
}

function EnvironmentDisplay({ id }: { id: string }) {
    const { data: environment, isLoading, isError, isSuccess } = useGetPactEnvironmentQuery(id);

    return (
        <div>
            {isError && <div>Error loading environment {id}</div>}
            {isLoading && <div>Loading {id}</div>}
            {isSuccess && environment !== undefined && (
                <Typography pb={4} variant="h4" gutterBottom>
                    {environment.displayName}
                </Typography>
            )}
            <Deployed environmentId={id}></Deployed>
        </div>
    );
}
