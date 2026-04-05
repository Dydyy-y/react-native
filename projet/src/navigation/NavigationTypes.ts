export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
};

export type LobbyStackParamList = {
  LobbyHome: undefined;
  CreateSession: undefined;
  JoinSession: undefined;
  SessionDetail: undefined;
};

export type GameStackParamList = {
  GameMain: undefined;
  GameOver: { sessionId: number };
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  GameHistory: undefined;
};

export type AppTabsParamList = {
  Lobby: undefined;
  Game: undefined;
  Profile: undefined;
};
