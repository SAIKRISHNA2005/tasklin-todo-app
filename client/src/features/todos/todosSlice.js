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
  listLoading: false,
  actionLoading: false,
  error: null,
  rollbackSnapshots: {},
  filters: {
    status: "",
    priority: "",
    tag: "",
    search: "",
    sort: "-createdAt",
    page: 1,
    limit: 10,
  },
};

function findTodoIndex(todos, id) {
  return todos.findIndex((todo) => todo._id === id);
}

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

export const toggleTodoComplete = createAsyncThunk(
  "todos/toggleTodoComplete",
  async (id, { getState, rejectWithValue }) => {
    const todo = getState().todos.todos.find((item) => item._id === id);
    if (!todo) {
      return rejectWithValue("Todo not found");
    }

    const nextStatus = todo.status === "completed" ? "pending" : "completed";

    try {
      return await todoService.patchTodo(id, { status: nextStatus });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const bulkCompleteTodos = createAsyncThunk(
  "todos/bulkCompleteTodos",
  async (ids, { rejectWithValue }) => {
    try {
      const results = await Promise.all(
        ids.map((id) => todoService.patchTodo(id, { status: "completed" }))
      );
      return results;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const bulkDeleteTodos = createAsyncThunk(
  "todos/bulkDeleteTodos",
  async (ids, { rejectWithValue }) => {
    try {
      await Promise.all(ids.map((id) => todoService.deleteTodo(id)));
      return ids;
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
      state.filters = { ...state.filters, ...action.payload, page: 1 };
    },
    setSearch(state, action) {
      state.filters.search = action.payload;
      state.filters.page = 1;
    },
    setSort(state, action) {
      state.filters.sort = action.payload;
      state.filters.page = 1;
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
    hydrateFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    saveRollbackSnapshot(state, action) {
      const { id } = action.payload;
      const index = findTodoIndex(state.todos, id);
      if (index !== -1) {
        state.rollbackSnapshots[id] = { ...state.todos[index] };
      }
    },
    saveBulkRollbackSnapshots(state, action) {
      action.payload.forEach((id) => {
        const index = findTodoIndex(state.todos, id);
        if (index !== -1) {
          state.rollbackSnapshots[id] = { ...state.todos[index] };
        }
      });
    },
    applyOptimisticPatch(state, action) {
      const { id, updates } = action.payload;
      const index = findTodoIndex(state.todos, id);
      if (index !== -1) {
        state.todos[index] = { ...state.todos[index], ...updates };
      }
    },
    applyOptimisticBulkComplete(state, action) {
      action.payload.forEach((id) => {
        const index = findTodoIndex(state.todos, id);
        if (index !== -1) {
          state.todos[index] = {
            ...state.todos[index],
            status: "completed",
          };
        }
      });
    },
    applyOptimisticBulkDelete(state, action) {
      const ids = new Set(action.payload);
      state.todos = state.todos.filter((todo) => !ids.has(todo._id));
      state.pagination.total = Math.max(
        0,
        state.pagination.total - action.payload.length
      );
    },
    revertOptimisticChange(state, action) {
      const { id } = action.payload;
      const snapshot = state.rollbackSnapshots[id];
      const index = findTodoIndex(state.todos, id);

      if (snapshot && index === -1) {
        state.todos.push(snapshot);
        state.pagination.total += 1;
      } else if (snapshot && index !== -1) {
        state.todos[index] = snapshot;
      }

      delete state.rollbackSnapshots[id];
    },
    revertBulkOptimisticChanges(state, action) {
      action.payload.forEach((id) => {
        const snapshot = state.rollbackSnapshots[id];
        const index = findTodoIndex(state.todos, id);

        if (snapshot && index === -1) {
          state.todos.push(snapshot);
          state.pagination.total += 1;
        } else if (snapshot && index !== -1) {
          state.todos[index] = snapshot;
        }

        delete state.rollbackSnapshots[id];
      });
    },
    clearRollbackSnapshots(state, action) {
      action.payload.forEach((id) => {
        delete state.rollbackSnapshots[id];
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.listLoading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.listLoading = false;
        state.todos = action.payload.todos;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.listLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchTodoById.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(fetchTodoById.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.currentTodo = action.payload;
      })
      .addCase(fetchTodoById.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      .addCase(createTodo.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.todos.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createTodo.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      .addCase(updateTodo.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.actionLoading = false;
        const index = findTodoIndex(state.todos, action.payload._id);
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
        if (state.currentTodo?._id === action.payload._id) {
          state.currentTodo = action.payload;
        }
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      .addCase(patchTodo.fulfilled, (state, action) => {
        const index = findTodoIndex(state.todos, action.payload._id);
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
        if (state.currentTodo?._id === action.payload._id) {
          state.currentTodo = action.payload;
        }
      })
      .addCase(patchTodo.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(toggleTodoComplete.pending, (state, action) => {
        const id = action.meta.arg;
        const index = findTodoIndex(state.todos, id);
        if (index !== -1) {
          state.rollbackSnapshots[id] = { ...state.todos[index] };
          state.todos[index].status =
            state.todos[index].status === "completed" ? "pending" : "completed";
        }
      })
      .addCase(toggleTodoComplete.fulfilled, (state, action) => {
        const index = findTodoIndex(state.todos, action.payload._id);
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
        delete state.rollbackSnapshots[action.payload._id];
      })
      .addCase(toggleTodoComplete.rejected, (state, action) => {
        const id = action.meta.arg;
        const snapshot = state.rollbackSnapshots[id];
        const index = findTodoIndex(state.todos, id);
        if (snapshot && index !== -1) {
          state.todos[index] = snapshot;
        }
        delete state.rollbackSnapshots[id];
        state.error = action.payload;
      })

      .addCase(deleteTodo.pending, (state, action) => {
        const id = action.meta.arg;
        const index = findTodoIndex(state.todos, id);
        if (index !== -1) {
          state.rollbackSnapshots[id] = { ...state.todos[index] };
          state.todos.splice(index, 1);
          state.pagination.total = Math.max(0, state.pagination.total - 1);
        }
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        delete state.rollbackSnapshots[action.payload];
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        const id = action.meta.arg;
        const snapshot = state.rollbackSnapshots[id];
        if (snapshot) {
          state.todos.push(snapshot);
          state.pagination.total += 1;
        }
        delete state.rollbackSnapshots[id];
        state.error = action.payload;
      })

      .addCase(bulkCompleteTodos.pending, (state, action) => {
        state.actionLoading = true;
        action.meta.arg.forEach((id) => {
          const index = findTodoIndex(state.todos, id);
          if (index !== -1) {
            state.rollbackSnapshots[id] = { ...state.todos[index] };
            state.todos[index].status = "completed";
          }
        });
      })
      .addCase(bulkCompleteTodos.fulfilled, (state, action) => {
        state.actionLoading = false;
        action.payload.forEach((todo) => {
          const index = findTodoIndex(state.todos, todo._id);
          if (index !== -1) {
            state.todos[index] = todo;
          }
          delete state.rollbackSnapshots[todo._id];
        });
      })
      .addCase(bulkCompleteTodos.rejected, (state, action) => {
        state.actionLoading = false;
        action.meta.arg.forEach((id) => {
          const snapshot = state.rollbackSnapshots[id];
          const index = findTodoIndex(state.todos, id);
          if (snapshot && index !== -1) {
            state.todos[index] = snapshot;
          }
          delete state.rollbackSnapshots[id];
        });
        state.error = action.payload;
      })

      .addCase(bulkDeleteTodos.pending, (state, action) => {
        state.actionLoading = true;
        const ids = new Set(action.meta.arg);
        action.meta.arg.forEach((id) => {
          const index = findTodoIndex(state.todos, id);
          if (index !== -1) {
            state.rollbackSnapshots[id] = { ...state.todos[index] };
          }
        });
        state.todos = state.todos.filter((todo) => !ids.has(todo._id));
        state.pagination.total = Math.max(
          0,
          state.pagination.total - action.meta.arg.length
        );
      })
      .addCase(bulkDeleteTodos.fulfilled, (state, action) => {
        state.actionLoading = false;
        action.payload.forEach((id) => {
          delete state.rollbackSnapshots[id];
        });
      })
      .addCase(bulkDeleteTodos.rejected, (state, action) => {
        state.actionLoading = false;
        action.meta.arg.forEach((id) => {
          const snapshot = state.rollbackSnapshots[id];
          if (snapshot) {
            state.todos.push(snapshot);
            state.pagination.total += 1;
          }
          delete state.rollbackSnapshots[id];
        });
        state.error = action.payload;
      });
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
  hydrateFilters,
  saveRollbackSnapshot,
  saveBulkRollbackSnapshots,
  applyOptimisticPatch,
  applyOptimisticBulkComplete,
  applyOptimisticBulkDelete,
  revertOptimisticChange,
  revertBulkOptimisticChanges,
  clearRollbackSnapshots,
} = todosSlice.actions;

export default todosSlice.reducer;
