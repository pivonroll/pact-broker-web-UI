import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Divider,
    Stack,
    Typography,
} from '@mui/material';
import format from 'date-fns/format';
import React from 'react';
import { useParams } from 'react-router-dom';
import {
    GetVerificationResultResponse,
    useGetVerificationResultQuery,
    VerificationResultTest,
} from './canIDeployApi';

export function PactResult() {
    const { consumer, provider, pact, metadata } = useParams();

    if (
        consumer === undefined ||
        provider === undefined ||
        pact === undefined ||
        metadata === undefined
    ) {
        return <div>Params are bad</div>;
    }

    return (
        <PactResultView consumer={consumer} provider={provider} pact={pact} metadata={metadata} />
    );
}

function PactResultView({
    consumer,
    provider,
    pact,
    metadata,
}: {
    consumer: string;
    provider: string;
    pact: string;
    metadata: string;
}) {
    const { data, isSuccess, isLoading, isError } = useGetVerificationResultQuery({
        consumerName: consumer,
        providerName: provider,
        pactVersion: pact,
        metadata,
    });

    return (
        <div>
            {isError && <div>Error sending a request</div>}
            {isLoading && <div>Loading pacticipants...</div>}
            {isSuccess && data !== undefined && <VerificationResult {...data} />}
        </div>
    );
}

function groupTestCases(data: VerificationResultTest[]) {
    const newData = new Map<string, VerificationResultTest[]>();

    data.forEach((currentElement) => {
        const key = currentElement.interactionProviderState + currentElement.interactionDescription;
        let existing = newData.get(key);

        if (existing === undefined) {
            existing = [currentElement];
            newData.set(key, existing);
        } else {
            existing.push(currentElement);
        }
    });

    const result = new Array<VerificationResultTest[]>();
    newData.forEach((item) => {
        result.push(item);
    });

    return result;
}

function VerificationResult(data: GetVerificationResultResponse) {
    const groupedCases = groupTestCases(data.testResults.tests);

    return (
        <div>
            <Typography pb={4} variant="h3">
                Verification Result
            </Typography>
            <Stack direction="row" spacing={4} sx={{ marginBottom: 1 }}>
                <Typography sx={{ width: '15%' }}>{data.providerName}</Typography>
                <Typography>{data.providerApplicationVersion}</Typography>
            </Stack>
            <Stack direction="row" spacing={4} sx={{ marginBottom: 3 }}>
                <Typography sx={{ width: '15%' }}>Verified on</Typography>
                <Typography pb={3}>
                    {format(new Date(data.verificationDate), 'yyyy-MM-dd HH:mm')}
                </Typography>
            </Stack>
            <Typography pb={2} variant="h4">
                Tests
            </Typography>
            {groupedCases.map((row) => {
                const isFailing = row.filter((item) => item.status !== 'passed').length > 0;
                return (
                    <Accordion
                        key={row[0].interactionProviderState + row[0].interactionDescription}
                        sx={{ marginBottom: 1 }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography pr={3} sx={{ width: '45%', flexShrink: 0 }}>
                                {row[0].interactionProviderState}
                            </Typography>
                            <Typography sx={{ width: '45%', color: 'text.secondary' }}>
                                {row[0].interactionDescription}
                            </Typography>
                            {isFailing ? (
                                <ErrorOutlineIcon sx={{ color: 'error.main' }} />
                            ) : (
                                <CheckCircleIcon sx={{ color: 'success.main' }} />
                            )}
                        </AccordionSummary>
                        <AccordionDetails>
                            {row.map((item, index, array) => {
                                return (
                                    <div key={item.testDescription}>
                                        <Stack
                                            direction="row"
                                            spacing={4}
                                            sx={{ paddingBottom: 3 }}
                                        >
                                            <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                                Test Description
                                            </Typography>
                                            <Typography>{item.testDescription}</Typography>
                                        </Stack>
                                        <Stack
                                            direction="row"
                                            spacing={4}
                                            sx={{ paddingBottom: 3 }}
                                        >
                                            <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                                Test Full Description
                                            </Typography>
                                            <Typography>{item.testFullDescription}</Typography>
                                        </Stack>
                                        <Stack
                                            direction="row"
                                            spacing={4}
                                            sx={{ paddingBottom: 3 }}
                                        >
                                            <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                                Actual Status
                                            </Typography>
                                            <Typography>{item.actualStatus}</Typography>
                                        </Stack>
                                        <Stack
                                            direction="row"
                                            spacing={4}
                                            sx={{ paddingBottom: 3 }}
                                        >
                                            <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                                Status
                                            </Typography>
                                            {item.status !== 'passed' ? (
                                                <ErrorOutlineIcon sx={{ color: 'error.main' }} />
                                            ) : (
                                                <CheckCircleIcon sx={{ color: 'success.main' }} />
                                            )}
                                        </Stack>

                                        {index !== array.length - 1 && (
                                            <Divider sx={{ marginBottom: 3 }} />
                                        )}
                                    </div>
                                );
                            })}
                        </AccordionDetails>
                    </Accordion>
                );
            })}
        </div>
    );
}
