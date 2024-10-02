export type User = {
  id: string;
  username: string;
  token: string;
  profilePic: string | null;
};

export type Post = {
  id: string;
  word: string;
  definition: string;
  partOfSpeech: string;
  createdAt: number;
  updatedAt: number;
  userId: string;
  username: string;
  profilePic: string | null;
  likesCount: number;
  favoritesCount: number;
  liked: 0 | 1;
  favorited: 0 | 1;
};

export type DictResponse = {
  word: string;
  phonetic: string;
  phonetics: {
    text: string;
    audio: string;
    sourceUrl: string;
    license: {
      name: string;
      url: string;
    };
  }[];
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      synonyms: string[];
      antonyms: string[];
    }[];
    synonyms: string[];
    antonyms: string[];
  }[];
  license: {
    name: string;
    url: string;
  };
  sourceUrls: string[];
};
