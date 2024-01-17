
export interface User {
  userName: string;
  password: string;
}

export interface Page {
  pageUrl: string;
  waitLoaded: () => void;
  navigate: () => Promise<string | void>;
}

export interface LoginPage {
  login(user: User): Promise<void>;
}
