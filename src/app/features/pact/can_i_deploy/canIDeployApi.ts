import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from '../../../../endpoints';

export const canIDeployApi = createApi({
    reducerPath: 'canIDeploy',
    baseQuery: fetchBaseQuery({ baseUrl }),
    endpoints: (builder) => ({
        canIDeploy: builder.query<CanIDeploy, CanIDeployRequest>({
            query: (request) =>
                `/matrix?q[][pacticipant]=${request.pacticipantName}&q[][version]=${request.pacticipantVersion}&latestby=cvp&environment=${request.environment}`,
            transformResponse: (response: CanIDeployResponse) => {
                const consumerPattern = new URLPattern({
                    pathname:
                        '/pacts/provider/:provider/consumer/:consumer/pact-version/:pact/metadata/:metadata/verification-results/200',
                });

                return {
                    summary: response.summary,
                    notices: response.notices,
                    matrix: response.matrix.map((matrixItem) => {
                        const consumerResult = consumerPattern.exec(
                            matrixItem.verificationResult._links.self.href
                        );

                        return {
                            consumer: matrixItem.consumer,
                            provider: matrixItem.provider,
                            verificationResult: {
                                success: matrixItem.verificationResult.success,
                                verifiedAt: matrixItem.verificationResult.verifiedAt,
                                consumerName: consumerResult?.pathname.groups.consumer ?? '',
                                providerName: consumerResult?.pathname.groups.provider ?? '',
                                pactVersion: consumerResult?.pathname.groups.pact ?? '',
                                metadata: consumerResult?.pathname.groups.metadata ?? '',
                            },
                        };
                    }),
                };
            },
        }),
        getVerificationResult: builder.query<
            GetVerificationResultResponse,
            VerificationResultRequest
        >({
            query: (request) =>
                `/pacts/provider/${request.providerName}/consumer/${request.consumerName}/pact-version/${request.pactVersion}/metadata/${request.metadata}/verification-results/200`,
            transformResponse: (response: GetVerificationResultResponse) => {
                return {
                    providerName: response.providerName,
                    providerApplicationVersion: response.providerApplicationVersion,
                    success: response.success,
                    verificationDate: response.verificationDate,
                    verifiedBy: response.verifiedBy,
                    testResults: response.testResults,
                };
            },
        }),
    }),
});

export const { useCanIDeployQuery, useGetVerificationResultQuery } = canIDeployApi;

export interface VerificationResultRequest {
    providerName: string;
    consumerName: string;
    pactVersion: string;
    metadata: string;
}

export interface CanIDeployRequest {
    pacticipantName: string;
    pacticipantVersion: string;
    environment: string;
}

export interface CanIDeploy {
    summary: {
        deployable: boolean;
        reason: string;
        success: number;
        failed: number;
        unknown: number;
    };
    notices: {
        type: string;
        text: string;
    }[];
    matrix: {
        consumer: {
            name: string;
            version: {
                number: string;
                branch: string | null;
                branches: {
                    name: string;
                    latest: boolean;
                }[];
                branchVersions: {
                    name: string;
                    latest: boolean;
                }[];
                environments: {
                    uuid: string;
                    name: string;
                    displayName: string;
                    production: boolean;
                    createdAt: string;
                }[];
                tags: {
                    name: string;
                    latest: boolean;
                }[];
            };
        };
        provider: {
            name: string;
            version: {
                number: string;
                branch: string | null;
                branches: {
                    name: string;
                    latest: boolean;
                }[];
                branchVersions: {
                    name: string;
                    latest: boolean;
                }[];
                environments: {
                    uuid: string;
                    name: string;
                    displayName: string;
                    production: boolean;
                    createdAt: string;
                }[];
                tags: {
                    name: string;
                    latest: boolean;
                }[];
            };
        };
        verificationResult: {
            success: boolean;
            verifiedAt: string;
            providerName: string;
            consumerName: string;
            pactVersion: string;
            metadata: string;
        };
    }[];
}

export interface CanIDeployResponse {
    summary: {
        deployable: boolean;
        reason: string;
        success: number;
        failed: number;
        unknown: number;
    };
    notices: {
        type: string;
        text: string;
    }[];
    matrix: {
        consumer: {
            name: string;
            version: {
                number: string;
                branch: string | null;
                branches: {
                    name: string;
                    latest: boolean;
                }[];
                branchVersions: {
                    name: string;
                    latest: boolean;
                }[];
                environments: {
                    uuid: string;
                    name: string;
                    displayName: string;
                    production: boolean;
                    createdAt: string;
                }[];
                tags: {
                    name: string;
                    latest: boolean;
                }[];
            };
        };
        provider: {
            name: string;
            version: {
                number: string;
                branch: string | null;
                branches: {
                    name: string;
                    latest: boolean;
                }[];
                branchVersions: {
                    name: string;
                    latest: boolean;
                }[];
                environments: {
                    uuid: string;
                    name: string;
                    displayName: string;
                    production: boolean;
                    createdAt: string;
                }[];
                tags: {
                    name: string;
                    latest: boolean;
                }[];
            };
        };
        pact: {
            createdAt: string;
            _links: {
                self: {
                    href: string;
                };
            };
        };
        verificationResult: {
            success: boolean;
            verifiedAt: string;
            _links: {
                self: {
                    href: string;
                };
            };
        };
    }[];
}

export interface GetVerificationResultResponse {
    providerName: string;
    providerApplicationVersion: string;
    success: boolean;
    verificationDate: string;
    testResults: {
        tests: VerificationResultTest[];
        summary: {
            testCount: number;
            failureCount: number;
        };
        metadata: {
            warning: string;
            pactVerificationResultsSpecification: {
                version: string;
            };
        };
    };
    verifiedBy: {};
}

export interface VerificationResultTest {
    testDescription: string;
    testFullDescription: string;
    status: string;
    interactionProviderState: string;
    interactionDescription: string;
    actualStatus: number;
}
