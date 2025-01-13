import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "user",
    initialState: {
        Token: null,
        UserName: null,
        Id: null,
        profileImg: null,
    },
    reducers: {
        userLogin(state: { Token: any; }, action: { payload: { token: null; }; }) {
            state.Token = action.payload.token;
        },
        userName(state, action) {
            state.UserName = action.payload.username;
        },
        userId(state, action) {
            state.Id = action.payload.id;
        },
        userProfile(state, action) {
            state.profileImg = action.payload.userprofile;
        },
        UserLogout(state) {
            state.Token = null;
            state.UserName = null;
            state.Id = null;
            state.profileImg = null;
        },
    },
});
export const {
    userLogin,
    userName,
    userId,
    userProfile,
    UserLogout,
} = userSlice.actions;
export default userSlice.reducer;

export const selectCurrentToken = (state: { user: { Token: string } }) =>
    state.user.Token;
export const selectCurrentName = (state: { user: { UserName: string } }) =>
    state.user.UserName;

export const selectCurrentId = (state: { user: { Id: string } }) =>
    state.user.Id;

export const selectProfile = (state: { user: { profileImg: string } }) =>
    state.user.profileImg;  
