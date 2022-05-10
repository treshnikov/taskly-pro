import { Action } from "./actions";

export interface AuthState {
    notes: string[];
}

const initialState = {
    notes: [],
};

export const authReducer = (state: AuthState = initialState, action: Action) => {
    switch (action.type) {
        case "ADD_NOTE": {
            return { ...state, notes: [...state.notes, action.payload] };
        }
        default:
            return state;
    }
};