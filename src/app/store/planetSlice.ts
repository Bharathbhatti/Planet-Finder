import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchColors,
  fetchShapes,
  fetchSizes,
  getFilteredPlanets,
} from "../API/getdata";

interface Planet {
  name: string;
  color: string;
  shape: string;
  size: string;
}

interface Color {
  id: string;
  name: string;
}

interface Shape {
  id: string;
  name: string;
}

interface Size {
  id: string;
  name: string;
}

interface Filters {
  q: string;
  color: string[];
  shape: string[];
  size: string[];
}

interface PlanetState {
  planets: Planet[];
  colors: Color[];
  shapes: Shape[];
  sizes: Size[];
  filters: Filters;
}

// Initial state
const initialState: PlanetState = {
  planets: [],
  colors: [],
  shapes: [],
  sizes: [],
  filters: {
    q: "",
    color: [],
    shape: [],
    size: [],
  },
};

// Fetch data asynchronously
export const loadInitialData = createAsyncThunk(
  "planets/loadData",
  async () => {
    const [colors, shapes, sizes] = await Promise.all([
      fetchColors(),
      fetchShapes(),
      fetchSizes(),
    ]);
    return { colors, shapes, sizes };
  }
);

export const applyFilters = createAsyncThunk(
  "planets/applyFilters",
  async (filters: Filters) => {
    return await getFilteredPlanets(filters);
  }
);

// Slice
const planetsSlice = createSlice({
  name: "planets",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Filters>) => {
      state.filters = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadInitialData.fulfilled, (state, action) => {
        state.colors = action.payload.colors;
        state.shapes = action.payload.shapes;
        state.sizes = action.payload.sizes;
      })
      .addCase(applyFilters.fulfilled, (state, action) => {
        state.planets = action.payload;
      });
  },
});

export const { setFilters } = planetsSlice.actions;
export default planetsSlice.reducer;
