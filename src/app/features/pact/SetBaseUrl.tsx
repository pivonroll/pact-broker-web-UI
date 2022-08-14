import React, { useCallback, useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { setBaseUrl as setUrl } from './pactSlice';

export default function SetBaseUrl() {
    const [baseUrl, setBaseUrl] = useState('');
    const dispatch = useAppDispatch();

    const handleChange = useCallback(
        (event: { target: { value: string } }) => {
            setBaseUrl(event.target.value);
        },
        [setBaseUrl]
    );

    const saveBaseUrl = useCallback(() => {
        dispatch(setUrl(baseUrl));
    }, [dispatch, baseUrl]);

    return (
        <div>
            <input value={baseUrl} onChange={handleChange}></input>
            <button onClick={saveBaseUrl}></button>
        </div>
    );
}
