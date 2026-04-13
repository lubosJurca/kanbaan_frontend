export type User = {
  id: number;
  username: string;
  email: string;
};

export type Board = {
  id: number;
  userId: number;
  title: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Column = {
  id: number;
  boardId: number;
  title: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Task = {
  id: number;
  columnId: number,
  title: string,
  description: string,
  order: number,
  createdAt: Date,
  updatedAt: Date
};

export type Subtask = {
  id: number;
  kanbanTaskId: number,
  title: string,
  description: string,
  order: number,
  done: boolean,
  createdAt: Date,
  updatedAt: Date
};

export type RegisterUserPayload = {
  username: string;
  email: string;
  password: string;
};

export type LoginUserPayload = {
  email: string;
  password: string;
};

export type AuthState = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
};

export type TaskPayload = {
  title: string,
  description: string
}
export type UpdateTaskPayload = {
  title: string,
  description?: string,
  columnId?: number
}