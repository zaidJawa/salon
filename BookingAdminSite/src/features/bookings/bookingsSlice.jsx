import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '../../hooks/useApiCall';

// Define the async thunk for fetching bookings based on search criteria
export const searchBookings = createAsyncThunk(
    '/bookings/search',
    async (searchParams, { rejectWithValue }) => {
        try {
            const response = await API({
                url: `/bookings/search`,
                method: 'GET',
                params: searchParams,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch bookings.'
            );
        }
    }
);


// Create the booking slice
export const bookingsSlice = createSlice({
    name: 'bookings',
    initialState: {
        isLoading: false,
        bookings: [], // List of bookings
        errorMessage: '', // Error message if any
    },
    reducers: {
        clearBookings: (state) => {
            state.bookings = []; // Clear the bookings array
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchBookings.pending, (state) => {
                state.isLoading = true;
                state.errorMessage = ''; // Clear any previous error messages
            })
            .addCase(searchBookings.fulfilled, (state, action) => {
                state.bookings = action.payload; // Store the fetched bookings
                state.isLoading = false;
            })
            .addCase(searchBookings.rejected, (state, action) => {
                state.isLoading = false;
                state.errorMessage = action.payload; // Store the error message
            });
    },
});

// Export actions for clearing bookings
export const { clearBookings } = bookingsSlice.actions;

// Export the reducer to be used in the store
export default bookingsSlice.reducer;
