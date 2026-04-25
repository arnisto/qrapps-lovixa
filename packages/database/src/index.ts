export { createAuthenticatedClient, createAnonymousClient } from './client';
export { createSyncEngine } from './realtime/sync-engine';
export { createSession, getSessionByToken, updateParticipantCount } from './queries/sessions';
export { castVote, getSessionVotes } from './queries/votes';

export type { SyncEngine, SyncEngineConfig } from './realtime/sync-engine';
export type { LovixaSupabaseClient } from './client';
