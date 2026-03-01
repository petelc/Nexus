import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ParticipantInfoDto, RealtimeCursorDto, SessionStatusDto } from '@/types/api.types';

interface CollaborationState {
  // Active session for the current resource being viewed
  activeSessionId: string | null;
  resourceId: string | null;
  resourceType: string | null;
  // Real-time participant list (maintained via SignalR)
  participants: ParticipantInfoDto[];
  cursorPositions: Record<string, RealtimeCursorDto>; // userId → cursor
  sessionStatus: string | null; // 'Active' | 'Inactive' | 'Ended'
  participantCount: number;
  // Panel visibility
  panelOpen: boolean;
  // Connection state
  isConnecting: boolean;
}

const initialState: CollaborationState = {
  activeSessionId: null,
  resourceId: null,
  resourceType: null,
  participants: [],
  cursorPositions: {},
  sessionStatus: null,
  participantCount: 0,
  panelOpen: false,
  isConnecting: false,
};

const collaborationSlice = createSlice({
  name: 'collaboration',
  initialState,
  reducers: {
    sessionJoined(
      state,
      action: PayloadAction<{ sessionId: string; resourceId: string; resourceType: string }>,
    ) {
      state.activeSessionId = action.payload.sessionId;
      state.resourceId = action.payload.resourceId;
      state.resourceType = action.payload.resourceType;
      state.panelOpen = true;
      state.isConnecting = false;
    },

    sessionLeft(state) {
      state.activeSessionId = null;
      state.resourceId = null;
      state.resourceType = null;
      state.participants = [];
      state.cursorPositions = {};
      state.sessionStatus = null;
      state.participantCount = 0;
      state.panelOpen = false;
      state.isConnecting = false;
    },

    setConnecting(state, action: PayloadAction<boolean>) {
      state.isConnecting = action.payload;
    },

    // Fired when SessionSynced arrives from hub (initial state on join)
    sessionSynced(
      state,
      action: PayloadAction<{ participants: ParticipantInfoDto[]; cursorPositions: RealtimeCursorDto[] }>,
    ) {
      state.participants = action.payload.participants;
      const cursors: Record<string, RealtimeCursorDto> = {};
      for (const c of action.payload.cursorPositions) {
        cursors[c.userId] = c;
      }
      state.cursorPositions = cursors;
    },

    participantJoined(state, action: PayloadAction<ParticipantInfoDto>) {
      const exists = state.participants.some((p) => p.userId === action.payload.userId);
      if (!exists) {
        state.participants.push(action.payload);
      }
    },

    participantLeft(state, action: PayloadAction<{ userId: string }>) {
      state.participants = state.participants.filter((p) => p.userId !== action.payload.userId);
      delete state.cursorPositions[action.payload.userId];
    },

    sessionStatusChanged(state, action: PayloadAction<SessionStatusDto>) {
      state.sessionStatus = action.payload.status;
      state.participantCount = action.payload.participantCount;
    },

    cursorMoved(state, action: PayloadAction<RealtimeCursorDto>) {
      state.cursorPositions[action.payload.userId] = action.payload;
    },

    setPanelOpen(state, action: PayloadAction<boolean>) {
      state.panelOpen = action.payload;
    },
  },
});

export const {
  sessionJoined,
  sessionLeft,
  setConnecting,
  sessionSynced,
  participantJoined,
  participantLeft,
  sessionStatusChanged,
  cursorMoved,
  setPanelOpen,
} = collaborationSlice.actions;

export default collaborationSlice.reducer;
