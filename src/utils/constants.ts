export const queues = {
  meilisearchQueue: 'MEILISEARCH_QUEUE',
};

export const searchAction = {
  ADD_UPDATE_NOTE: 'ADD_UPDATE_NOTE',
  DELETE_NOTE: 'DELETE_NOTE',
};

export const rateLimit = {
  ttl: 60,
  limit: 10,
};

export const RATE_LIMITER = {
  MAX_POST_RATE_LIMIT: 30,
  MAX_POST_RATE_DURATION: 60,
  MAX_GET_RATE_LIMIT: 70000,
  MAX_GET_RATE_DURATION: 360,
};
