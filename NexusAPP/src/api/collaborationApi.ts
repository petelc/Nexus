import { createApi } from '@reduxjs/toolkit/query/react';
import type {
  CollaborationSessionDto,
  CommentDto,
  StartSessionDto,
  AddCommentDto,
  UpdateCommentDto,
  AddReplyDto,
} from '@types/api.types';
import { baseQueryWithReauth } from './baseQueryWithReauth';

export const collaborationApi = createApi({
  reducerPath: 'collaborationApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Session', 'Comments'],
  endpoints: (builder) => ({
    // ── Sessions ──────────────────────────────────────────────────────────────

    startSession: builder.mutation<CollaborationSessionDto, StartSessionDto>({
      query: (body) => ({ url: 'collaboration/sessions', method: 'POST', body }),
      invalidatesTags: ['Session'],
    }),

    getSession: builder.query<CollaborationSessionDto, string>({
      query: (sessionId) => `collaboration/sessions/${sessionId}`,
      providesTags: (_r, _e, sessionId) => [{ type: 'Session', id: sessionId }],
    }),

    getActiveSessions: builder.query<CollaborationSessionDto[], void>({
      query: () => 'collaboration/sessions/active',
      providesTags: ['Session'],
    }),

    getUserSessions: builder.query<CollaborationSessionDto[], void>({
      query: () => 'collaboration/sessions/my',
      providesTags: ['Session'],
    }),

    joinSession: builder.mutation<CollaborationSessionDto, { sessionId: string; role?: string }>({
      query: ({ sessionId, role = 'Editor' }) => ({
        url: `collaboration/sessions/${sessionId}/join`,
        method: 'POST',
        body: { role },
      }),
      invalidatesTags: (_r, _e, { sessionId }) => [{ type: 'Session', id: sessionId }],
    }),

    leaveSession: builder.mutation<void, string>({
      query: (sessionId) => ({
        url: `collaboration/sessions/${sessionId}/leave`,
        method: 'POST',
      }),
      invalidatesTags: ['Session'],
    }),

    endSession: builder.mutation<void, string>({
      query: (sessionId) => ({
        url: `collaboration/sessions/${sessionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Session'],
    }),

    // ── Comments ──────────────────────────────────────────────────────────────

    getResourceComments: builder.query<CommentDto[], string>({
      query: (resourceId) => `collaboration/resources/${resourceId}/comments`,
      providesTags: (_r, _e, resourceId) => [{ type: 'Comments', id: resourceId }],
    }),

    getComment: builder.query<CommentDto, string>({
      query: (commentId) => `collaboration/comments/${commentId}`,
      providesTags: (_r, _e, commentId) => [{ type: 'Comments', id: commentId }],
    }),

    addComment: builder.mutation<CommentDto, AddCommentDto>({
      query: (body) => ({ url: 'collaboration/comments', method: 'POST', body }),
      invalidatesTags: (_r, _e, { resourceId }) => [{ type: 'Comments', id: resourceId }],
    }),

    updateComment: builder.mutation<CommentDto, { commentId: string; data: UpdateCommentDto }>({
      query: ({ commentId, data }) => ({
        url: `collaboration/comments/${commentId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_r, _e, { commentId }) => [{ type: 'Comments', id: commentId }],
    }),

    deleteComment: builder.mutation<void, string>({
      query: (commentId) => ({ url: `collaboration/comments/${commentId}`, method: 'DELETE' }),
      invalidatesTags: ['Comments'],
    }),

    replyToComment: builder.mutation<CommentDto, { commentId: string; data: AddReplyDto }>({
      query: ({ commentId, data }) => ({
        url: `collaboration/comments/${commentId}/reply`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Comments'],
    }),
  }),
});

export const {
  useStartSessionMutation,
  useGetSessionQuery,
  useGetActiveSessionsQuery,
  useGetUserSessionsQuery,
  useJoinSessionMutation,
  useLeaveSessionMutation,
  useEndSessionMutation,
  useGetResourceCommentsQuery,
  useGetCommentQuery,
  useAddCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useReplyToCommentMutation,
} = collaborationApi;
