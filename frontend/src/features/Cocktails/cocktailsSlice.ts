import {ICocktail} from "../../types";
import {createSlice} from "@reduxjs/toolkit";
import {
    cocktailsFetch,
    createCocktail,
    deleteCocktail,
    makePublicCocktail,
    oneCocktailFetch
} from "./cocktailsThunk.ts";
import {RootState} from "../../app/store.ts";

interface CocktailsState {
    cocktails: ICocktail[],
    cocktail: ICocktail | null,
    fetchLoading: boolean,
    oneFetchLoading: boolean,
    createLoading: boolean,
    deleteLoading: boolean | string,
    publicLoading: boolean | string
}

const initialState: CocktailsState = {
    cocktails: [],
    cocktail: null,
    fetchLoading: false,
    oneFetchLoading: false,
    createLoading: false,
    deleteLoading: false,
    publicLoading: false,
};

export const CocktailsSlice = createSlice({
    name: "cocktails",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(cocktailsFetch.pending, (state) => {
            state.fetchLoading = true;
        });
        builder.addCase(cocktailsFetch.fulfilled, (state, {payload: cocktails}) => {
            state.fetchLoading = false;
            state.cocktails = cocktails
        });
        builder.addCase(cocktailsFetch.rejected, (state) => {
            state.fetchLoading = false;
        });

        builder.addCase(oneCocktailFetch.pending, (state) => {
            state.oneFetchLoading = true;
        });
        builder.addCase(oneCocktailFetch.fulfilled, (state, {payload: cocktail}) => {
            state.oneFetchLoading = false;
            state.cocktail = cocktail
        });
        builder.addCase(oneCocktailFetch.rejected, (state) => {
            state.oneFetchLoading = false;
        });

        builder.addCase(createCocktail.pending, (state) => {
            state.createLoading = true;
        });
        builder.addCase(createCocktail.fulfilled, (state) => {
            state.createLoading = false;
        });
        builder.addCase(createCocktail.rejected, (state) => {
            state.createLoading = false;
        });

        builder.addCase(deleteCocktail.pending, (state, action) => {
            state.deleteLoading = state.deleteLoading = action.meta.arg;
        });
        builder.addCase(deleteCocktail.fulfilled, (state) => {
            state.deleteLoading =false;
        });
        builder.addCase(deleteCocktail.rejected, (state) => {
            state.deleteLoading = false;
        });

        builder.addCase(makePublicCocktail.pending, (state, action) => {
            state.publicLoading = action.meta.arg;
        });
        builder.addCase(makePublicCocktail.fulfilled, (state ) => {
            state.publicLoading = false;
        });
        builder.addCase(makePublicCocktail.rejected, (state) => {
            state.publicLoading = false;
        });
    }
});

export const selectCocktails = (state: RootState) => state.cocktails.cocktails;
export const selectOneCocktail = (state: RootState) => state.cocktails.cocktail;
export const selectCocktailsLoading = (state: RootState) => state.cocktails.fetchLoading;
export const selectOneCocktailLoading = (state: RootState) => state.cocktails.oneFetchLoading;
export const selectCreateCocktailLoading = (state: RootState) => state.cocktails.createLoading;
export const selectDeleteCocktailLoading = (state: RootState) => state.cocktails.deleteLoading;
export const selectPublicLoading = (state: RootState) => state.cocktails.publicLoading;

export const cocktailsReducer = CocktailsSlice.reducer;