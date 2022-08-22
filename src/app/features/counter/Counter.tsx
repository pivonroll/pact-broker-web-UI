import React from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { decrement, increment, selectCount } from './counterSlice';
import Button from '@mui/material/Button';

export default function Counter() {
    const count = useAppSelector(selectCount);
    const dispatch = useAppDispatch();

    return (
        <div>
            <span>{count}</span>
            <Button onClick={() => dispatch(increment())}>Increment</Button>
            <Button onClick={() => dispatch(decrement())}>Decrement</Button>
        </div>
    );
}
