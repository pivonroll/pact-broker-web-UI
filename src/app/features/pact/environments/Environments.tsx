import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ResponseEnvironment, useGetPactEnvironmentsQuery } from './thunks/environments';

export default function Environments() {
    const { data: environments, isError, isLoading, isSuccess } = useGetPactEnvironmentsQuery('');

    const renderEnvironments = useCallback((envList: ResponseEnvironment[]) => {
        return envList.map((item, index, array) => {
            return (
                <div key={item.uuid}>
                    <Environment name={item.name} displayName={item.displayName} uuid={item.uuid} />
                    {index !== array.length - 1 && <hr />}
                </div>
            );
        });
    }, []);

    return (
        <div>
            {isError && <div>Error while loading environments</div>}
            {isLoading && <div>Loading environments...</div>}
            {isSuccess && renderEnvironments(environments)}
        </div>
    );
}

function Environment({ name, displayName, uuid }: ResponseEnvironment) {
    return (
        <div>
            <div>UUID: {uuid}</div>
            <div>name: {name}</div>
            <div>display name: {displayName}</div>
            <Link to={`/environments/${uuid}`}>Go</Link>
        </div>
    );
}
