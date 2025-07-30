import { ITeamInfo } from "@/types/data";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Initial state
interface IInitialState {
    teamInfo: ITeamInfo[]
}

const initialState: IInitialState = {
    teamInfo: []
};

const teamData = createSlice({
    name: "teamData",
    initialState,
    reducers: {
        addTeamMember: (state, action: PayloadAction<ITeamInfo>) => {
            state.teamInfo.push(action.payload);
        },

        deleteTeamMember: (state, action: PayloadAction<string>) => {
            state.teamInfo = state.teamInfo.filter(
                (member) => member._id !== action.payload
            );
        },
        updateTeamMember: (state, action: PayloadAction<ITeamInfo>) => {
            const index = state.teamInfo.findIndex(
                (member) => member._id === action.payload._id
            );
            if (index !== -1) {
                state.teamInfo[index] = action.payload;
            }
        },
        setTeamMembers: (state, action: PayloadAction<ITeamInfo[]>) => {
            state.teamInfo = action.payload;
        },
    },
});

export const {
    addTeamMember,
    deleteTeamMember,
    updateTeamMember,
    setTeamMembers,
} = teamData.actions;

export default teamData;
