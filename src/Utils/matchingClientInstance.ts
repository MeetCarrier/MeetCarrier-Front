import { MatchingClient } from './Matching';

let client: MatchingClient | null = null;

export const setMatchingClient = (newClient: MatchingClient) => {
  client = newClient;
};

export const getMatchingClient = () => client;

export const clearMatchingClient = () => {
  if (client) {
    client.disconnect();
    client = null;
  }
};
