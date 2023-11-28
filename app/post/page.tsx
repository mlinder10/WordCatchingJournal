"use client";
import { UserContext } from "@/components/userProvider";
import { parseDefinitions } from "@/config/helpers";
import { Definition } from "@/config/types";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { VscArrowRight, VscLoading } from "react-icons/vsc";
import styles from "./post.module.css";
import LoadingView from "@/components/LoadingView";

export default function Post() {
  const { user } = useContext(UserContext);
  const [word, setWord] = useState("");
  const [definition, setDefinition] = useState("");
  const [definitions, setDefinitions] = useState<
    Definition[] | "empty" | "loading" | "error"
  >("empty");

  useEffect(() => {
    async function fetchDefinitions() {
      setDefinitions("loading");
      if (word === "") return setDefinitions("empty");
      try {
        const response = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
        );
        const data = await response.json();
        setDefinitions(parseDefinitions(data));
      } catch (err: any) {
        setDefinitions("error");
        console.error(err?.message);
      }
    }

    const timeoutId = setTimeout(fetchDefinitions, 500);
    return () => clearTimeout(timeoutId);
  }, [word]);

  async function postWord() {
    if (user === null || word === "" || definition === "") return;
    try {
      const response = await fetch("/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ word, definition, user: user }),
      });
      const data = await response.json();
      setWord("");
      setDefinition("");
      console.log(data);
    } catch (err: any) {
      console.error(err?.message);
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.columns}>
        <div className={styles.input}>
          <h1>Post</h1>
          <input
            type="text"
            placeholder="Enter a word"
            value={word}
            onChange={(e) => setWord(e.target.value)}
          />
          <textarea
            cols={30}
            rows={10}
            placeholder="Enter a definition"
            value={definition}
            onChange={(e) => setDefinition(e.target.value)}
          />
          <button onClick={postWord}>
            <span>Post</span>
            <VscArrowRight />
          </button>
        </div>
        <div className={styles.definitions}>
          <h1>Definitions</h1>
          {definitions === "loading" && <LoadingView />}
          {definitions === "error" && (
            <p className={styles["definition-message"]}>
              Error fetching definitions for &quot;{word}&quot;
            </p>
          )}
          {definitions === "empty" && (
            <p className={styles["definition-message"]}>
              Enter a word to search for definitions
            </p>
          )}
          {definitions !== "loading" &&
            definitions !== "error" &&
            definitions !== "empty" && (
              <Definitions
                definitions={definitions}
                definition={definition}
                setDefinition={setDefinition}
              />
            )}
        </div>
      </div>
    </main>
  );
}

type DefinitionsProps = {
  definitions: Definition[];
  definition: string;
  setDefinition: Dispatch<SetStateAction<string>>;
};

function Definitions({
  definitions,
  definition,
  setDefinition,
}: DefinitionsProps) {
  return (
    <>
      {definitions.map((def) => (
        <div
          key={def.definition}
          className={styles.definition}
          onClick={() => setDefinition(def.definition)}
        >
          <p className={definition === def.definition ? styles.active : ""}>
            {def.definition}
          </p>
          <p className={styles.partOfSpeech}>{def.partOfSpeech}</p>
        </div>
      ))}
    </>
  );
}
