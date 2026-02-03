import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface JobState {
  jobs: any[];
  featuredJobs: any[];
  loading: boolean;
  filters: {
    keyword: string;
    location: string;
    category: string;
  };
}

const initialState: JobState = {
  jobs: [],
  featuredJobs: [],
  loading: false,
  filters: {
    keyword: '',
    location: '',
    category: '',
  },
};

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setJobs: (state, action: PayloadAction<any[]>) => {
      state.jobs = action.payload;
    },
    setFeaturedJobs: (state, action: PayloadAction<any[]>) => {
      state.featuredJobs = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setFilters: (state, action: PayloadAction<any>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
});

export const { setJobs, setFeaturedJobs, setLoading, setFilters } = jobSlice.actions;
export default jobSlice.reducer;
