// @/redux/comments/commentSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '@/redux/store'; // Sesuaikan path store Anda

// Interface untuk User di dalam Komentar
interface CommentUser {
  id: string;
  name: string;
  username: string | null;
  photoprofile: string | null;
}

// Interface rekursif untuk Komentar dengan Balasan
export interface Comment {
  id: string;
  content: string;
  user: CommentUser;
  createdAt: string;
  updatedAt: string | null; // Nullable
  replies: Comment[]; // Komentar bisa memiliki balasan
}

interface CommentsState {
  comments: Comment[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  nextCursor: string | null; // Untuk infinite scroll komentar
  hasMore: boolean; // Menunjukkan apakah ada lebih banyak komentar
}

const initialState: CommentsState = {
  comments: [],
  status: 'idle',
  error: null,
  nextCursor: null,
  hasMore: true,
};

// ===============================================
// Async Thunk untuk Mendapatkan Komentar per Item (dengan Infinite Scroll)
// API: GET /api/comment/getByItem/{idItem}
// ===============================================
interface FetchCommentsPayload {
  idItem: string;
  //authToken: string;
  limit?: number;
  cursor?: string;
  replace?: boolean; // Untuk mengontrol apakah akan mengganti atau menambahkan komentar
}

export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (payload: FetchCommentsPayload, { rejectWithValue }) => {
    const { idItem, limit = 5, cursor, replace } = payload; 
    try {
      const params = { limit, cursor };
      const response = await axios.get(`http://localhost:8889/api/comment/getByItem/${idItem}`, { //
     //    headers: { Authorization: `Bearer ${authToken}` }, // Memerlukan token
        params: params,
      });
      return {
        data: response.data.data as Comment[], //
        nextCursor: response.data.nextCursor as string | null, //
        replace, // Teruskan properti replace
      };
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.errors || 'Failed to fetch comments');
      }
      return rejectWithValue('An unexpected error occurred during comment fetch');
    }
  }
);

// ===============================================
// Async Thunk untuk Membuat Komentar Baru
// API: POST /api/comment
// ===============================================
interface CreateCommentPayload {
  itemId: string;
  userId: string; 
  content: string;
  parentId?: string; 
  authToken: string;
}

export const createComment = createAsyncThunk(
  'comments/createComment',
  async (payload: CreateCommentPayload, { rejectWithValue }) => {
    const { authToken, ...commentData } = payload;
    try {
      const response = await axios.post('http://localhost:8889/api/comment', commentData, { //
        headers: { Authorization: `Bearer ${authToken}` }, // Memerlukan token
      });
      return response.data.data as Comment; // Mengembalikan komentar yang baru dibuat
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.errors || 'Failed to create comment');
      }
      return rejectWithValue('An unexpected error occurred during comment creation');
    }
  }
);

// ===============================================
// Async Thunk untuk Memperbarui Komentar
// API: PATCH /api/comment/{idComment}
// ===============================================
interface UpdateCommentPayload {
  idComment: string;
  content: string;
  authToken: string;
}

export const updateComment = createAsyncThunk(
  'comments/updateComment',
  async (payload: UpdateCommentPayload, { rejectWithValue }) => {
    const { idComment, authToken, content } = payload;
    try {
      const response = await axios.patch(`http://localhost:8889/api/comment/${idComment}`, { content }, { //
        headers: { Authorization: `Bearer ${authToken}` }, // Memerlukan token
      });
      return response.data.data as Comment; // Mengembalikan komentar yang diperbarui
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.errors || 'Failed to update comment');
      }
      return rejectWithValue('An unexpected error occurred during comment update');
    }
  }
);

// ===============================================
// Async Thunk untuk Menghapus Komentar
// API: DELETE /api/comment/{idComment}
// ===============================================
interface DeleteCommentPayload {
  idComment: string;
  authToken: string;
}

export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (payload: DeleteCommentPayload, { rejectWithValue }) => {
    const { idComment, authToken } = payload;
    try {
      const response = await axios.delete(`http://localhost:8889/api/comment/${idComment}`, { //
        headers: { Authorization: `Bearer ${authToken}` }, // Memerlukan token
      });
      return { success: response.data.data as boolean, idComment }; // Mengembalikan status sukses dan ID komentar
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.errors || 'Failed to delete comment');
      }
      return rejectWithValue('An unexpected error occurred during comment deletion');
    }
  }
);


const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    // Reducer untuk membersihkan komentar saat mengganti item
    clearComments: (state) => {
      state.comments = [];
      state.status = 'idle';
      state.error = null;
      state.nextCursor = null;
      state.hasMore = true;
    },
    // Reducer untuk menambahkan komentar ke daftar lokal (opsional, jika ingin respons cepat)
    addLocalComment: (state, action: PayloadAction<Comment>) => {
      state.comments.unshift(action.payload); // Tambahkan di awal daftar
    },
    // Reducer untuk memperbarui komentar di daftar lokal (opsional)
    updateLocalComment: (state, action: PayloadAction<Comment>) => {
      const index = state.comments.findIndex(comment => comment.id === action.payload.id);
      if (index !== -1) {
        state.comments[index] = action.payload;
      }
    },
    // Reducer untuk menghapus komentar dari daftar lokal (opsional)
    removeLocalComment: (state, action: PayloadAction<string>) => {
      state.comments = state.comments.filter(comment => comment.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchComments
      .addCase(fetchComments.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action: PayloadAction<{ data: Comment[]; nextCursor: string | null; replace?: boolean }>) => {
        state.status = 'succeeded';
        const { data, nextCursor, replace = false } = action.payload;
        if (replace) {
          state.comments = data;
        } else {
          state.comments.push(...data);
        }
        state.nextCursor = nextCursor;
        state.hasMore = !!nextCursor;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || action.error.message || 'Failed to fetch comments';
        state.hasMore = false;
      })

      // Handle createComment
      .addCase(createComment.pending, (state) => {
        // status tetap 'succeeded' jika sudah ada data, atau 'loading' jika ini yang pertama
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action: PayloadAction<Comment, string, { arg: CreateCommentPayload }>) => {
        if (!action.meta.arg.parentId) { // Asumsi thunk punya parentId di meta.arg
          state.comments.unshift(action.payload);
        } else {
          findCommentAndAddReply(state.comments, action.meta.arg.parentId, action.payload);
        }
        state.status = 'succeeded'; // Set status ke succeeded setelah operasi berhasil
      })
      .addCase(createComment.rejected, (state, action) => {
        state.status = 'failed'; // Bisa juga tetap 'succeeded' tapi error, tergantung UX
        state.error = (action.payload as string) || action.error.message || 'Failed to create comment';
      })

      // Handle updateComment
      .addCase(updateComment.fulfilled, (state, action: PayloadAction<Comment>) => {
        // Cari komentar dan perbarui di state
        updateCommentInTree(state.comments, action.payload);
        state.status = 'succeeded';
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.error = (action.payload as string) || action.error.message || 'Failed to update comment';
        state.status = 'failed';
      })

      // Handle deleteComment
      .addCase(deleteComment.fulfilled, (state, action: PayloadAction<{ success: boolean; idComment: string }>) => {
        if (action.payload.success) {
          // Hapus komentar dari state (perlu logika rekursif atau flat list)
          state.comments = removeCommentFromTree(state.comments, action.payload.idComment);
        }
        state.status = 'succeeded';
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.error = (action.payload as string) || action.error.message || 'Failed to delete comment';
        state.status = 'failed';
      });
  },
});

// Helper function (opsional, jika Anda ingin mengelola nested replies di frontend)
function findCommentAndAddReply(comments: Comment[], parentId: string, newReply: Comment): boolean {
  for (let i = 0; i < comments.length; i++) {
    if (comments[i].id === parentId) {
      comments[i].replies.push(newReply);
      return true;
    }
    if (comments[i].replies.length > 0) {
      if (findCommentAndAddReply(comments[i].replies, parentId, newReply)) {
        return true;
      }
    }
  }
  return false;
}

function updateCommentInTree(comments: Comment[], updatedComment: Comment): boolean {
    for (let i = 0; i < comments.length; i++) {
        if (comments[i].id === updatedComment.id) {
            comments[i] = updatedComment;
            return true;
        }
        if (comments[i].replies.length > 0) {
            if (updateCommentInTree(comments[i].replies, updatedComment)) {
                return true;
            }
        }
    }
    return false;
}

function removeCommentFromTree(comments: Comment[], idToRemove: string): Comment[] {
    return comments.filter(comment => {
        if (comment.id === idToRemove) {
            return false;
        }
        if (comment.replies.length > 0) {
            comment.replies = removeCommentFromTree(comment.replies, idToRemove);
        }
        return true;
    });
}


export const { clearComments, addLocalComment, updateLocalComment, removeLocalComment } = commentsSlice.actions; // Ekspor reducer lokal

export const selectComments = (state: RootState) => state.comments.comments;
export const selectCommentsStatus = (state: RootState) => state.comments.status;
export const selectCommentsError = (state: RootState) => state.comments.error;
export const selectCommentsNextCursor = (state: RootState) => state.comments.nextCursor;
export const selectHasMoreComments = (state: RootState) => state.comments.hasMore;

export default commentsSlice.reducer;