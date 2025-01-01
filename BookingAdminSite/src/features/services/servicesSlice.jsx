import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from "../../hooks/useApiCall";

// Fetch services
export const getServicesContent = createAsyncThunk(
    '/services/content',
    async ({ page = 1, limit = 10 }) => {
        const response = await API({
            url: `services?page=${page}&limit=${limit}`,
            method: 'GET',
        });
        return response.data;
    }
);

export const addService = createAsyncThunk(
    'services/addService',
    async (serviceData, { dispatch, rejectWithValue }) => {
        try {
            const response = await API({
                url: 'services',
                method: 'POST',
                data: serviceData,
            });

            if (response.data) {
                dispatch(getServicesContent({}));
                return response.data;
            } else {
                return rejectWithValue('Failed to add the service');
            }
        } catch (error) {
            return rejectWithValue('An error occurred while adding the service');
        }
    }
);

// Delete service
export const deleteService = createAsyncThunk(
    'services/deleteService',
    async (serviceId, { dispatch }) => {
        try {
            const response = await API({
                url: `services/${serviceId}`,
                method: 'DELETE',
            });

            if (response.data.message) {
                dispatch(getServicesContent());
                return true;
            }
        } catch (error) {
            throw new Error('Error deleting service');
        }
    }
);

export const servicesSlice = createSlice({
    name: 'services',
    initialState: {
        isLoading: false,
        servicesList: [],
        errorMessage: '',
        pagination: {},
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch services
            .addCase(getServicesContent.pending, (state) => {
                state.isLoading = true;
                state.errorMessage = '';
            })
            .addCase(getServicesContent.fulfilled, (state, action) => {
                const { docs, ...others } = action.payload;
                state.servicesList = docs;
                state.pagination = others;
                state.isLoading = false;
            })
            .addCase(getServicesContent.rejected, (state, action) => {
                state.isLoading = false;
                state.errorMessage = action.payload || 'Failed to fetch services. Please try again later.';
            })
            // Add service
            .addCase(addService.pending, (state) => {
                state.isLoading = true;
                state.errorMessage = '';
            })
            .addCase(addService.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(addService.rejected, (state, action) => {
                state.isLoading = false;
                state.errorMessage = action.payload || 'Failed to add the service. Please try again later.';
            })
            // Delete service
            .addCase(deleteService.pending, (state) => {
                state.isLoading = true;
                state.errorMessage = '';
            })
            .addCase(deleteService.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(deleteService.rejected, (state, action) => {
                state.isLoading = false;
                state.errorMessage = action.payload || 'Failed to delete the service. Please try again later.';
            });
    },
});

export default servicesSlice.reducer;
