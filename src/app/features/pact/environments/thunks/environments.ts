import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const pactApiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000' }),
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
        }),
        getPactDeployedOnEnvironment: builder.query({
            query: (environmentId) =>
                `/environments/${environmentId}/deployed-versions/currently-deployed`,
        }),
    }),
});

export const {
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
