import React from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { decrement, increment, selectCount } from './counterSlice';

export default function Counter() {
    const count = useAppSelector(selectCount);
    const dispatch = useAppDispatch();

    return (
        <div>
            <span>{count}</span>
            <button onClick={() => dispatch(increment())}>Increment</button>
            <button onClick={() => dispatch(decrement())}>Decrement</button>
        </div>
    );
}
