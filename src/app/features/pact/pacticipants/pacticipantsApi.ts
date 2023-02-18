import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { baseUrl } from '../../../../endpoints';

export const pacticipantsApi = createApi({
    reducerPath: 'pacticipants',
    baseQuery: fetchBaseQuery({ baseUrl }),
    endpoints: (builder) => ({
        getPacticipants: builder.query<Pacticipant[], string>({
            query: () => '/pacticipants',
            transformResponse: (response: PacticipantsResponse) => {
                return response._embedded.pacticipants.map((item) => {
                    return {
                        name: item.name,
                        displayName: item.displayName,
                        mainBranch: item.mainBranch,
                        latestVersion: item._embedded.latestVersion?.number,
                        labels: item._embedded.labels,
                    };
                });
            },
        }),
        getPacticipantByName: builder.query<Pacticipant, string>({
            query: (name) => `/pacticipants/${name}`,
            transformResponse: (response: PacticipantResponse) => {
                return {
                    name: response.name,
                    displayName: response.displayName,
                    mainBranch: response.mainBranch,
                    latestVersion: response._embedded.latestVersion?.number,
                    labels: response._embedded.labels,
                };
            },
        }),
        getPacticipantVersions: builder.query<PacticipantVersion[], string>({
            query: (name) => `/pacticipants/${name}/versions`,
            transformResponse: (response: PacticipantResponseBranches) => {
                return response._embedded.versions.map((item) => {
                    return {
                        versionNumber: item.number,
                        createdAt: item.createdAt,
                        branchVersions: item._embedded.branchVersions.map((version) => {
                            return {
                                name: version.name,
                                latest: version.latest,
                            };
                        }),
                        tags: item._embedded.tags,
                    };
                });
            },
        }),
        getPacticipantGroup: builder.query<GroupCSV[], string>({
            query: (name) => ({
                url: `/groups/${name}.csv`,
                responseHandler: async (response) => {
                    const txt = await response.text();
                    const parsed = parseGroupCSV(txt);
                    return parsed;
                },
            }),
        }),
    }),
});

export const {
    useGetPacticipantsQuery,
    useGetPacticipantByNameQuery,
    useGetPacticipantVersionsQuery,
    useGetPacticipantGroupQuery,
} = pacticipantsApi;

export interface Pacticipant {
    name: string;
    displayName: string;
    mainBranch: string;
    latestVersion?: string;
    labels: string[];
}

interface PacticipantResponse {
    name: string;
    displayName: string;
    mainBranch: string;
    _embedded: {
        latestVersion?: {
            number: string;
        };
        labels: string[];
    };
}

interface PacticipantsResponse {
    _embedded: {
        pacticipants: PacticipantResponse[];
    };
}

interface PacticipantResponseBranch {
    name: string;
    latest?: boolean;
}

interface PacticipantResponseBranches {
    _embedded: {
        versions: {
            number: string;
            createdAt: string;
            _embedded: {
                branchVersions: PacticipantResponseBranch[];
                tags: string[];
            };
        }[];
    };
}

export interface PacticipantBranchVersion {
    name: string;
    latest?: boolean;
}

export interface PacticipantVersion {
    versionNumber: string;
    createdAt: string;
    branchVersions: PacticipantBranchVersion[];
    tags: string[];
}

function parseGroupCSV(data: any): GroupCSV[] {
    const rows = data.split('\n') as Array<any>;
    if (rows.length > 0 && rows[rows.length - 1] == '') {
        rows.splice(rows.length - 1);
    }

    return rows.map((element: any) => {
        const columns = element.split(',');
        return {
            id: columns[0],
            name: columns[1],
            target: columns[6] !== '0' ? columns[6] : undefined,
        };
    });
}

interface GroupCSV {
    id: string;
    name: string;
    target?: string;
}
