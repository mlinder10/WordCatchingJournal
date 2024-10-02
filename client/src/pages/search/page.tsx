import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import LoadableData from "../../components/loadable-data/loadable-data";
import PostView from "../../components/post-view/post-view";
import Searchbar from "../../components/searchbar/searchbar";
import Multiselect from "../../components/multiselect/multiselect";
import ProfilePic from "../../components/profile-pic/profile-pic";
import { Link } from "react-router-dom";
import { getApi } from "../../utils";
import { Post } from "../../types";

type SearchResult = UserResult | PostResult;

type UserResult = {
  type: "user";
  id: string;
  username: string;
  profilePic: string | null;
};

type PostResult = Post & { type: "post" };

type FilterType = "users" | "words" | "definitions";

const FILTER_OPTIONS: FilterType[] = ["users", "words", "definitions"];

export default function Search() {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType[]>([]);

  async function handleSearch(
    limit: number,
    offset: number,
    clear: boolean = false
  ) {
    if (search === "") {
      return;
    }

    setSearchLoading(true);
    setSearchError(null);
    try {
      const res = await getApi().post<SearchResult[]>(
        `/api/search?limit=${limit}&offset=${offset}`,
        {
          search,
          filter,
        }
      );
      if (clear) {
        setSearchResults(res.data);
      } else {
        setSearchResults([...searchResults, ...res.data]);
      }
    } catch (err) {
      console.error(err);
      setSearchError("Failed to search");
    } finally {
      setSearchLoading(false);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleSearch(10, 0, true);
    }, 500);
    return () => {
      clearTimeout(timeout);
    };
  }, [search, filter]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.search}>
          <Searchbar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            clear={setSearch.bind(null, "")}
            placeholder="Search..."
          />
        </div>
        <div className={styles.filters}>
          <Multiselect
            selected={filter}
            setSelected={setFilter}
            options={FILTER_OPTIONS}
            placeholder="Filter"
            alias={(option) => option[0].toUpperCase() + option.slice(1)}
          />
        </div>
        {/* Add filter */}
      </div>
      <LoadableData loading={searchLoading} error={searchError}>
        <div className={styles["search-results"]}>
          {searchResults.map((result) =>
            result.type === "user" ? (
              <UserView key={result.id} user={result} />
            ) : (
              <PostView key={result.id} post={result} />
            )
          )}
        </div>
      </LoadableData>
    </div>
  );
}

type UserViewProps = {
  user: UserResult;
};

function UserView({ user }: UserViewProps) {
  return (
    <Link to={`/profile/${user.id}`} className={styles.user}>
      <ProfilePic
        size={80}
        profilePic={user.profilePic}
        username={user.username}
      />
      <p className={styles.username}>{user.username}</p>
    </Link>
  );
}
