"use client";
import { useContext, useEffect, useState } from "react";
import styles from "./search.module.css";
import { User, Post } from "@/config/types";
import LoadingView from "@/components/LoadingView";
import { VscSearch } from "react-icons/vsc";
import { UserContext } from "@/components/userProvider";
import PostCell from "@/components/Post";
import UserCell from "@/components/User";

export default function Search() {
  const { user } = useContext(UserContext);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<
    { users: User[]; posts: Post[] } | "loading" | "error" | "empty"
  >("empty");

  useEffect(() => {
    async function fetchResults() {
      if (search === "") return setResults("empty");
      setResults("loading");
      try {
        const response = await fetch(`/api/search?search=${search}`);
        if (!response.ok) throw Error();
        const data = await response.json();
        if (data.users.length === 0 && data.posts.length === 0) {
          return setResults("error");
        }
        setResults(data);
      } catch (err: any) {
        setResults("error");
        console.error(err?.message);
      }
    }

    let timeoutId = setTimeout(fetchResults, 500);
    return () => clearTimeout(timeoutId);
  }, [search]);

  function updatePosts(post: Post) {
    if (results === "loading" || results === "error" || results === "empty")
      return;
    let newPosts = [...results.posts];
    for (let i = 0; i < newPosts.length; i++) {
      if (newPosts[i].pid === post.pid) {
        newPosts[i] = post;
        break;
      }
    }
    setResults({ ...results, posts: newPosts });
  }

  return (
    <main className={styles.main}>
      <h1>Search</h1>
      <div className={styles.filter}>
        <div className={styles.search}>
          <VscSearch className={styles.icon} />
          <input
            type="text"
            placeholder="Search for users and words..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span />
        <button>Filter</button>
      </div>
      <div className={styles.resultsContainer}>
        {results === "loading" && <LoadingView />}
        {results === "error" && <p>Error fetching results for &quot;{search}&quot;</p>}
        {results === "empty" && <p>Enter a search</p>}
        {results !== "loading" &&
          results !== "error" &&
          results !== "empty" && (
            <SearchResults
              results={results}
              user={user}
              updatePosts={updatePosts}
            />
          )}
      </div>
    </main>
  );
}

type SearchResultsProps = {
  results: {
    users: User[];
    posts: Post[];
  };
  user: User | null;
  updatePosts: (post: Post) => void;
};

function SearchResults({ results, user, updatePosts }: SearchResultsProps) {
  return (
    <div className={styles.results}>
      <div className={styles.users}>
        {results.users.map((user) => (
          <UserCell key={user.uid} user={user} />
        ))}
      </div>
      <div className={styles.posts}>
        {results.posts.map((post) => (
          <PostCell
            key={post.pid}
            post={post}
            user={user}
            updatePosts={updatePosts}
          />
        ))}
      </div>
    </div>
  );
}
