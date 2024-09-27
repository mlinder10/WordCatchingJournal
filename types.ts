export type User = {
  id: string;
  username: string;
  email: string;
  password: string;
  token: string | null;
  profilePic: string | null;
  createdAt: number;
  updatedAt: number;
};

export type Post = {
  id: string;
  word: string;
  definition: string;
  partOfSpeech: string;
  createdAt: number;
  updatedAt: number;
  userId: string;
};

export type Like = {
  userId: string;
  postId: string;
};

export type Favorite = {
  userId: string;
  postId: string;
};

export type Following = {
  userId: string;
  followingId: string;
};
