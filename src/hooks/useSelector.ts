import { useSelector as useReduxSelector } from 'react-redux';

import { State } from '../redux/createStore';

export const useSelector = () => useReduxSelector((state: State) => state);
