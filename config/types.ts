import { Row } from "@libsql/client";

export class User {
  uid: string;
  email: string;
  username: string;
  password: string;
  followers: string[];
  following: string[];
  profileImageUrl: string;

  constructor(
    uid: string,
    email: string,
    username: string,
    password: string,
    followers: string[],
    following: string[],
    profileImageUrl: string
  ) {
    this.uid = uid;
    this.email = email;
    this.username = username;
    this.password = password;
    this.followers = followers;
    this.following = following;
    this.profileImageUrl = profileImageUrl;
  }

  static fromRow(row: any) {
    return new User(
      row.uid,
      row.email,
      row.username,
      row.password,
      JSON.parse(row.followers),
      JSON.parse(row.following),
      row.profileImageUrl
    );
  }

  static fromRows(rows: Row[]) {
    return rows.map((row) => User.fromRow(row));
  }

  toJson() {
    return JSON.stringify(this);
  }

  static isUser = (x: any): x is User => {
    return (
      x.uid !== undefined &&
      x.email !== undefined &&
      x.username !== undefined &&
      x.password !== undefined &&
      x.followers !== undefined &&
      x.following !== undefined &&
      x.profileImageUrl !== undefined
    );
  };
}

export class Post {
  pid: string;
  uid: string;
  word: string;
  definition: string;
  email: string;
  username: string;
  profileImageUrl: string;
  createdAt: string;
  likes: string[];

  constructor(
    pid: string,
    uid: string,
    word: string,
    definition: string,
    email: string,
    username: string,
    profileImageUrl: string,
    createdAt: string,
    likes: string[]
  ) {
    this.pid = pid;
    this.uid = uid;
    this.word = word;
    this.definition = definition;
    this.email = email;
    this.username = username;
    this.profileImageUrl = profileImageUrl;
    this.createdAt = createdAt;
    this.likes = likes;
  }

  static fromRow(row: any) {
    return new Post(
      row.pid,
      row.uid,
      row.word,
      row.definition,
      row.email,
      row.username,
      row.profileImageUrl,
      row.createdAt,
      JSON.parse(row.likes)
    );
  }

  static fromRows(rows: Row[]) {
    return rows.map((row) => Post.fromRow(row));
  }

  toJson() {
    return JSON.stringify(this);
  }

  static isPost = (x: any): x is Post => {
    return (
      x.pid !== undefined &&
      x.uid !== undefined &&
      x.word !== undefined &&
      x.definition !== undefined &&
      x.email !== undefined &&
      x.username !== undefined &&
      x.profileImageUrl !== undefined &&
      x.createdAt !== undefined &&
      x.likes !== undefined
    );
  };
}

export type FetchedDefinition = {
  word: string;
  phonetic: string;
  origin?: string;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example?: string;
      synonyms: Array<string>;
      antonyms: Array<string>;
    }>;
  }>;
};

export type Definition = {
  word: string;
  definition: string;
  example?: string;
  synonyms: Array<string>;
  antonyms: Array<string>;
  origin?: string;
  partOfSpeech: string;
};
