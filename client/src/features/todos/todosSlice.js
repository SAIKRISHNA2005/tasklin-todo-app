import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { todoService } from "../../services/todoService.js";

const initialState = {
  todos: [],
  currentTodo: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  },
  loading: false,
  error: null,
  filters: {
    status: "",
    priority: "",
    tag: "",
    search: "",
    sort: "",
    page: 1,
    limit: 10,
  },
};

export const fetchTodos = createAsyncThunk(
  "todos/fetchTodos",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { filters } = getState().todos;
      return await todoService.getTodos(filters);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTodoById = createAsyncThunk(
  "todos/fetchTodoById",
  async (id, { rejectWithValue }) => {
    try {
      return await todoService.getTodoById(id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createTodo = createAsyncThunk(
  "todos/createTodo",
  async (todo, { rejectWithValue }) => {
    try {
      return await todoService.createTodo(todo);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTodo = createAsyncThunk(
  "todos/updateTodo",
  async ({ id, todo }, { rejectWithValue }) => {
    try {
      return await todoService.updateTodo(id, todo);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const patchTodo = createAsyncThunk(
  "todos/patchTodo",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      return await todoService.patchTodo(id, updates);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTodo = createAsyncThunk(
  "todos/deleteTodo",
  async (id, { rejectWithValue }) => {
    try {
      await todoService.deleteTodo(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSearch(state, action) {
      state.filters.search = action.payload;
      state.filters.page = 1;
    },
    setSort(state, action) {
      state.filters.sort = action.payload;
    },
    setPage(state, action) {
      state.filters.page = action.payload;
    },
    setLimit(state, action) {
      state.filters.limit = action.payload;
      state.filters.page = 1;
    },
    clearError(state) {
      state.error = null;
    },
    clearCurrentTodo(state) {
      state.currentTodo = null;
    },
  },
  extraReducers: (builder) => {
    const setPending = (state) => {
      state.loading = true;
      state.error = null;
    };

    const setRejected = (state, action) => {
      state.loading = false;
      state.error = action.payload;
    };

    builder
      .addCase(fetchTodos.pending, setPending)
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.todos = action.payload.todos;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTodos.rejected, setRejected)

      .addCase(fetchTodoById.pending, setPending)
      .addCase(fetchTodoById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTodo = action.payload;
      })
      .addCase(fetchTodoById.rejected, setRejected)

      .addCase(createTodo.pending, setPending)
      .addCase(createTodo.fulfilled, (state, action) => {
        state.loading = false;
        state.todos.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createTodo.rejected, setRejected)

      .addCase(updateTodo.pending, setPending)
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.todos.findIndex(
          (todo) => todo._id === action.payload._id
        );
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
        if (state.currentTodo?._id === action.payload._id) {
          state.currentTodo = action.payload;
        }
      })
      .addCase(updateTodo.rejected, setRejected)

      .addCase(patchTodo.pending, setPending)
      .addCase(patchTodo.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.todos.findIndex(
          (todo) => todo._id === action.payload._id
        );
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
        if (state.currentTodo?._id === action.payload._id) {
          state.currentTodo = action.payload;
        }
      })
      .addCase(patchTodo.rejected, setRejected)

      .addCase(deleteTodo.pending, setPending)
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.loading = false;
        state.todos = state.todos.filter((todo) => todo._id !== action.payload);
        state.pagination.total = Math.max(0, state.pagination.total - 1);
        if (state.currentTodo?._id === action.payload) {
          state.currentTodo = null;
        }
      })
      .addCase(deleteTodo.rejected, setRejected);
  },
});

export const {
  setFilters,
  setSearch,
  setSort,
  setPage,
  setLimit,
  clearError,
  clearCurrentTodo,
} = todosSlice.actions;

export default todosSlice.reducer;
