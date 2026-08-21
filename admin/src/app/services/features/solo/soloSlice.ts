// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { fetchSoloApi, type GetSoloParams } from "./soloApi";
// import { mapsolo } from "./soloMapper";
// import type { Solo } from "./solo.types";

// type SoloState = {
//   data: Solo[];
//   total: number;
//   loading: boolean;
//   error: string | null;
// };

// const initialState: SoloState = {
//   data: [],
//   total: 0,
//   loading: false,
//   error: null,
// };

// export const fetchSolo = createAsyncThunk(
//   "solo/fetch",
//   async (params: GetSoloParams) => {
//     const res = await fetchSoloApi(params);

//     console.log("API RAW RESPONSE:", res);

//     return {
//       data: res.data.map(mapsolo),
//       total: res.total,
//     };
//   },
// );

// const SoloSlice = createSlice({
//   name: "solo",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchSolo.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchSolo.fulfilled, (state, action) => {
//         state.loading = false;
//         state.data = action.payload.data;
//         state.total = action.payload.total;
//       })
//       .addCase(fetchSolo.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message || "Failed to fetch Solo Traders";
//       });
//   },
// });

// export default SoloSlice.reducer;
