import {createAsyncThunk} from "@reduxjs/toolkit";
import {ICocktail, ICocktailMutation} from "../../types";
import {RootState} from "../../app/store.ts";
import axiosApi from "../../axiosApi.ts";

export const cocktailsFetch = createAsyncThunk<ICocktail[], string | null, {state: RootState}> (
    "cocktails/fetchAll",
    async (userId) => {
        const response = await axiosApi.get('/cocktails', {
            params: userId ? { userId } : undefined})
        return response.data;
    }
);

export const oneCocktailFetch = createAsyncThunk<ICocktail, string> (
    "cocktails/fetchOne",
    async (id) => {
        const response = await axiosApi.get(`cocktails/${id}`)
        return response.data;
    }
);

export const createCocktail = createAsyncThunk<void, ICocktailMutation>(
    "cocktails/create",
    async (newCocktail) => {
        const formData = new FormData();
        const keys = Object.keys(newCocktail) as (keyof ICocktailMutation)[];

        keys.forEach((key) => {
            const value = newCocktail[key];

            if (value !== null) {
                formData.append(key, JSON.stringify(value));
            }
        });
        await axiosApi.post('/cocktails', formData);
    }
);

export const deleteCocktail = createAsyncThunk<void, string>(
    "cocktails/delete",
    async (id) => {
        await axiosApi.delete(`cocktails/${id}`);
    }
);

export const makePublicCocktail = createAsyncThunk<void, string>(
    "cocktails/makePublish",
    async (id) => {
        await axiosApi.patch(`cocktails/${id}/togglePublished`);
    }
);