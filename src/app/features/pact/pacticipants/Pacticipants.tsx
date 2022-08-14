import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Pacticipant, useGetPacticipantsQuery } from './pacticipantsApi';

export default function Pacticipants() {
    const { data: pacticipants, isError, isLoading, isSuccess } = useGetPacticipantsQuery('');

    const renderPacticipants = useCallback(() => {
        if (pacticipants !== undefined) {
            return pacticipants.map((item, index, array) => {
                return (
                    <div key={item.name + item.latestVersion ?? '' + index}>
                        <PacticipantSummary
                            name={item.name}
                            displayName={item.displayName}
                            latestVersion={item.latestVersion}
                            mainBranch={item.mainBranch}
                        />
                        {index !== array.length - 1 && <hr />}
                    </div>
                );
            });
        }

        return null;
    }, [pacticipants]);

    return (
        <div>
            <div>Pacticipants</div>
            {isError && <div>Error loading pacticipants</div>}
            {isLoading && <div>Loading pacticipants...</div>}
            {isSuccess && <div>{renderPacticipants()}</div>}
        </div>
    );
}

function PacticipantSummary({
    name,
    displayName,
    latestVersion,
    mainBranch,
}: Partial<Pacticipant>) {
    return (
        <div>
            <div>Name: {displayName}</div>
            <div>Latest Version: {latestVersion}</div>
            <div>Main branch: {mainBranch}</div>
            <div>
                <Link to={`/pacticipants/${name}`}>Go</Link>
            </div>
        </div>
    );
}
