import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Canvas, EdgeData, NodeData } from 'reaflow';
import {
    useGetPacticipantByNameQuery,
    useGetPacticipantVersionsQuery,
    PacticipantVersion,
    useGetPacticipantGroupQuery,
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
            <div>Pacticipant</div>
            {isError && <div>Error loading pacticipant</div>}
            {isLoading && <div>Loading pacticipant...</div>}
            {isSuccess && (
                <div>
                    <div>Name: {pacticipant.displayName}</div>
                    <div>Main Branch: {pacticipant.mainBranch}</div>
                    <div>Latest Version: {pacticipant.latestVersion}</div>
                    <hr />
                    <PacticipantVersions name={name} />
                    <hr />
                    <PacticipantGroup name={name} />
                </div>
            )}
        </div>
    );
}

function PacticipantVersions({ name }: { name: string }) {
    const { data: versions, isError, isLoading, isSuccess } = useGetPacticipantVersionsQuery(name);

    const renderVersions = useCallback(() => {
        if (versions !== undefined) {
            return versions.map((item, index, array) => {
                return (
                    <div key={item.versionNumber}>
                        <PacticipantVersionView
                            versionNumber={item.versionNumber}
                            createdAt={item.createdAt}
                        />
                        {index !== array.length - 1 && <hr />}
                    </div>
                );
            });
        }

        return null;
    }, [versions]);

    return (
        <div>
            <div>Versions</div>
            {isError && <div>Error loading pacticipant versions</div>}
            {isLoading && <div>Loading pacticipant versions...</div>}
            {isSuccess && <div>{renderVersions()}</div>}
        </div>
    );
}

function PacticipantVersionView({ versionNumber, createdAt }: Partial<PacticipantVersion>) {
    return (
        <div>
            <div>Number: {versionNumber}</div>
            <div>CreatedAt: {createdAt}</div>
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
            <div>Group</div>
            {isError && <div>Error loading pacticipant group</div>}
            {isLoading && <div>Loading pacticipant group...</div>}
            {isSuccess && <div>Loaded Group</div>}
            <Canvas
                maxWidth={800}
                maxHeight={600}
                nodes={constructNodes()}
                edges={constructEdges()}
            />
        </div>
    );
}
