import { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import { signalRClient } from '@api/signalrClient';
import {
  sessionJoined,
  sessionLeft,
  setConnecting,
  sessionSynced,
  participantJoined,
  participantLeft,
  sessionStatusChanged,
  cursorMoved,
} from '../collaborationSlice';
import {
  useStartSessionMutation,
  useJoinSessionMutation,
  useLeaveSessionMutation,
  useEndSessionMutation,
  useGetResourceCommentsQuery,
} from '@api/collaborationApi';
import type {
  ParticipantInfoDto,
  RealtimeCursorDto,
  SessionStatusDto,
  SessionSyncDto,
} from '@types/api.types';

export function useCollaboration(resourceId: string, resourceType: 'Document' | 'Diagram') {
  const dispatch = useAppDispatch();
  const state = useAppSelector((s) => s.collaboration);
  const currentUserId = useAppSelector((s) => s.auth.user?.userId);

  const [startSession] = useStartSessionMutation();
  const [joinSession] = useJoinSessionMutation();
  const [leaveSession] = useLeaveSessionMutation();
  const [endSession] = useEndSessionMutation();

  const { data: comments = [], refetch: refetchComments } = useGetResourceCommentsQuery(resourceId, {
    skip: !state.activeSessionId,
  });

  // Track whether we've registered SignalR handlers for this session
  const handlersRegistered = useRef(false);

  const registerSignalRHandlers = useCallback(() => {
    if (handlersRegistered.current) return;
    handlersRegistered.current = true;

    const onSessionSynced = (data: SessionSyncDto) => {
      dispatch(
        sessionSynced({
          participants: data.activeParticipants,
          cursorPositions: data.cursorPositions,
        }),
      );
    };

    const onParticipantJoined = (data: ParticipantInfoDto) => {
      dispatch(participantJoined(data));
    };

    const onParticipantLeft = (data: ParticipantInfoDto) => {
      dispatch(participantLeft({ userId: data.userId }));
    };

    const onSessionStatusChanged = (data: SessionStatusDto) => {
      dispatch(sessionStatusChanged(data));
    };

    const onCursorMoved = (data: RealtimeCursorDto) => {
      dispatch(cursorMoved(data));
    };

    const onCommentAdded = () => {
      refetchComments();
    };

    signalRClient.on('SessionSynced', onSessionSynced);
    signalRClient.on('ParticipantJoined', onParticipantJoined);
    signalRClient.on('ParticipantLeft', onParticipantLeft);
    signalRClient.on('SessionStatusChanged', onSessionStatusChanged);
    signalRClient.on('CursorMoved', onCursorMoved);
    signalRClient.on('CommentAdded', onCommentAdded);

    return () => {
      signalRClient.off('SessionSynced', onSessionSynced);
      signalRClient.off('ParticipantJoined', onParticipantJoined);
      signalRClient.off('ParticipantLeft', onParticipantLeft);
      signalRClient.off('SessionStatusChanged', onSessionStatusChanged);
      signalRClient.off('CursorMoved', onCursorMoved);
      signalRClient.off('CommentAdded', onCommentAdded);
    };
  }, [dispatch, refetchComments]);

  // Clean up handlers when session ends
  useEffect(() => {
    if (!state.activeSessionId) {
      handlersRegistered.current = false;
    }
  }, [state.activeSessionId]);

  const startOrJoinSession = useCallback(async () => {
    dispatch(setConnecting(true));
    try {
      // Connect SignalR if not already connected
      if (!signalRClient.isConnected) {
        await signalRClient.connect();
      }

      // Try to start a session (409 = already exists → join instead)
      let sessionId: string;
      try {
        const session = await startSession({ resourceType, resourceId }).unwrap();
        sessionId = session.sessionId;
      } catch (err: any) {
        if (err?.status === 409) {
          // Active session already exists — find and join it
          const joinResult = await joinSession({
            sessionId: err?.data?.sessionId ?? '',
            role: 'Editor',
          }).unwrap();
          sessionId = joinResult.sessionId;
        } else {
          throw err;
        }
      }

      // Register SignalR event handlers
      const cleanup = registerSignalRHandlers();

      // Tell the hub we've joined
      await signalRClient.invoke('JoinSession', sessionId);

      dispatch(sessionJoined({ sessionId, resourceId, resourceType }));

      return cleanup;
    } catch (err) {
      dispatch(setConnecting(false));
      throw err;
    }
  }, [dispatch, resourceId, resourceType, startSession, joinSession, registerSignalRHandlers]);

  const leaveCurrentSession = useCallback(async () => {
    const sessionId = state.activeSessionId;
    if (!sessionId) return;

    try {
      await signalRClient.invoke('LeaveSession', sessionId);
      await leaveSession(sessionId);
    } finally {
      handlersRegistered.current = false;
      dispatch(sessionLeft());
    }
  }, [state.activeSessionId, leaveSession, dispatch]);

  const endCurrentSession = useCallback(async () => {
    const sessionId = state.activeSessionId;
    if (!sessionId) return;

    try {
      await signalRClient.invoke('LeaveSession', sessionId);
      await endSession(sessionId);
    } finally {
      handlersRegistered.current = false;
      dispatch(sessionLeft());
    }
  }, [state.activeSessionId, endSession, dispatch]);

  const updateCursorPosition = useCallback(
    async (position: number) => {
      const sessionId = state.activeSessionId;
      if (!sessionId || !signalRClient.isConnected) return;
      await signalRClient.invoke('UpdateCursorPosition', sessionId, position);
    },
    [state.activeSessionId],
  );

  const notifyTyping = useCallback(
    async (isTyping: boolean) => {
      const sessionId = state.activeSessionId;
      if (!sessionId || !signalRClient.isConnected) return;
      await signalRClient.invoke('NotifyTyping', sessionId, isTyping);
    },
    [state.activeSessionId],
  );

  const isInSession = state.activeSessionId !== null && state.resourceId === resourceId;

  return {
    isInSession,
    isConnecting: state.isConnecting,
    sessionId: state.activeSessionId,
    participants: state.participants,
    participantCount: state.participantCount,
    sessionStatus: state.sessionStatus,
    panelOpen: state.panelOpen,
    comments,
    currentUserId,
    startOrJoinSession,
    leaveCurrentSession,
    endCurrentSession,
    updateCursorPosition,
    notifyTyping,
  };
}
