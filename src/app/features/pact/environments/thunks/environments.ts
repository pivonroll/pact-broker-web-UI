import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const pactApiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000' }),
    tagTypes: ['Environment'],
    endpoints: (builder) => ({
        getPactEnvironments: builder.query<ResponseEnvironment[], unknown>({
            query: () => '/environments',
            transformResponse: (response: ResponseEnvironments) => {
                return response._embedded.environments.map((item) => {
                    return {
                        uuid: item.uuid,
                        name: item.name,
                        displayName: item.displayName,
                    };
                });
            },
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(({ uuid }) => ({ type: 'Environment' as const, id: uuid })),
                          { type: 'Environment', id: 'LIST' },
                      ]
                    : [{ type: 'Environment', id: 'LIST' }],
        }),
        getPactEnvironment: builder.query<ResponseEnvironment, string>({
            query: (environmentId) => `/environments/${environmentId}`,
            transformResponse: (response: ResponseEnvironment) => {
                return {
                    uuid: response.uuid,
                    name: response.name,
                    displayName: response.displayName,
                };
            },
            providesTags: (result, error, id) => [{ type: 'Environment', id }],
        }),
        getPactDeployedOnEnvironment: builder.query<DeployedApp[], string>({
            query: (environmentId) =>
                `/environments/${environmentId}/deployed-versions/currently-deployed`,
            transformResponse: (response: ResponseDeployedApps) => {
                return response._embedded.deployedVersions.map((item) => {
                    return {
                        uuid: item.uuid,
                        pacticipantName: item._embedded.pacticipant.name,
                        version: item._embedded.version.number,
                    };
                });
            },
        }),
        createEnvironment: builder.mutation<CreateEnvironment, CreateEnvironmentRequest>({
            query: (request) => {
                return {
                    method: 'POST',
                    url: '/environments',
                    body: {
                        name: request.name,
                        production: request.isProduction,
                    },
                };
            },
            transformResponse: (response: CreateEnvironmentResponse) => {
                return {
                    uuid: response.uuid,
                    name: response.name,
                    displayName: response.displayName,
                    production: response.production,
                    createdAt: response.createdAt,
                };
            },
            invalidatesTags: [{ type: 'Environment', id: 'LIST' }],
        }),
        deleteEnvironment: builder.mutation<any, string>({
            query: (environmentsId) => {
                return {
                    method: 'DELETE',
                    url: `/environments/${environmentsId}`,
                };
            },
            invalidatesTags: (result, error, environmentsId) => [
                { type: 'Environment', environmentsId },
            ],
        }),
    }),
});

export interface CreateEnvironmentRequest {
    name: string;
    isProduction: boolean;
}

export interface CreateEnvironment {
    uuid: string;
    name: string;
    displayName: string;
    production: boolean;
    createdAt: string;
}

export interface CreateEnvironmentResponse {
    uuid: string;
    name: string;
    displayName: string;
    production: boolean;
    createdAt: string;
}

export const {
    useCreateEnvironmentMutation,
    useDeleteEnvironmentMutation,
    useGetPactEnvironmentsQuery,
    useGetPactEnvironmentQuery,
    useGetPactDeployedOnEnvironmentQuery,
} = pactApiSlice;

export interface ResponseEnvironment {
    uuid: string;
    name: string;
    displayName: string;
}

interface ResponseEmbeddedEnvironments {
    environments: ResponseEnvironment[];
}

interface ResponseEnvironments {
    _embedded: ResponseEmbeddedEnvironments;
}

interface ResponseDeployedApps {
    _embedded: {
        deployedVersions: ResponseDeployedApp[];
    };
}

interface ResponseDeployedApp {
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

export interface DeployedApp {
    uuid: string;
    pacticipantName: string;
    version: string;
}
