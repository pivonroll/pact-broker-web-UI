import React, { useCallback } from 'react';
import { useGetPactDeployedOnEnvironmentQuery } from './thunks/environments';

export default function Deployed({ environmentId }: { environmentId: string }) {
    const {
        data: deployed,
        isError,
        isLoading,
        isSuccess,
    } = useGetPactDeployedOnEnvironmentQuery(environmentId);

    const renderDeployed = useCallback((deployed: DeployedApps) => {
        return deployed._embedded.deployedVersions.map((item, index, array) => {
            return (
                <div key={item.uuid}>
                    <div>UUID: {item.uuid}</div>
                    <div>Name: {item._embedded.pacticipant.name}</div>
                    <div>Version: {item._embedded.version.number}</div>
                    {index !== array.length - 1 && <hr />}
                </div>
            );
        });
    }, []);

    return (
        <div>
            {isError && <div>Error loading deployed</div>}
            {isLoading && <div>Loading deployed...</div>}
            {isSuccess && renderDeployed(deployed as DeployedApps)}
        </div>
    );
}

interface DeployedApps {
    _embedded: {
        deployedVersions: DeployedApp[];
    };
}

interface DeployedApp {
    uuid: string;
    _embedded: {
        pacticipant: {
            name: string;
        };
        version: {
            number: string;
        };
    };
}
