// TypeScript 때문에 정의한 거임..
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// dispatch 타입 명시
export const useAppDispatch = () => useDispatch<AppDispatch>();

// selector 타입 명시
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
