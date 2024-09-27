import axios from "axios";
import styles from "./styles.module.css";
import { DictResponse } from "../../types";
import { useContext, useState } from "react";
import LoadableData from "../../components/loadable-data/loadable-data";
import LoadingButton from "../../components/loading-button/loading-button";
import FloatingInput from "../../components/floating-input/floating-input";
import FloatingTextarea from "../../components/floating-textarea/floating-textarea";
import BorderedButton from "../../components/bordered-button/bordered-button";
import { FaArrowUp, FaSearch } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { AuthContext } from "../../contexts/AuthProvider";

const DICTIONARY_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";

async function getDefinition(word: string) {
  const res = await axios.get<DictResponse[]>(DICTIONARY_URL + word);
  return res.data;
}

export default function Page() {
  const { user } = useContext(AuthContext);
  const [responses, setResponses] = useState<DictResponse[]>([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [postLoading, setPostLoading] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);
  const [word, setWord] = useState("");
  const [definition, setDefinition] = useState("");
  const [partOfSpeech, setPartOfSpeech] = useState("");

  async function handleFetch() {
    setFetchLoading(true);
    setFetchError(null);
    try {
      const res = await getDefinition(word);
      setResponses(res);
    } catch (err) {
      console.error(err);
      setFetchError("Failed to fetch definitions for " + word);
    } finally {
      setFetchLoading(false);
    }
  }

  async function handlePost() {
    setPostLoading(true);
    setPostError(null);
    try {
      await axios.post("/api/posts", {
        word,
        definition,
        partOfSpeech,
        userId: user?.id,
      });
      setWord("");
      setDefinition("");
      setPartOfSpeech("");
      setResponses([]);
    } catch (err) {
      console.error(err);
      setPostError("Failed to post");
    } finally {
      setPostLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles["input-container"]}>
        <div className={styles["word-input"]}>
          <FloatingInput
            placeholder="Word"
            value={word}
            onChange={(e) => setWord(e.target.value)}
          />
          <LoadingButton
            loading={fetchLoading}
            onClick={handleFetch}
            disabled={word.length === 0}
          >
            <FaSearch />
            <span>Define</span>
          </LoadingButton>
        </div>
        <FloatingInput
          placeholder="Part of Speech"
          value={partOfSpeech}
          onChange={(e) => setPartOfSpeech(e.target.value)}
        />
        <FloatingTextarea
          placeholder="Definition"
          value={definition}
          onChange={(e) => setDefinition(e.target.value)}
        />
        <div className={styles.buttons}>
          <LoadingButton
            loading={postLoading}
            onClick={handlePost}
            disabled={word.length === 0 || definition.length === 0}
          >
            <FaArrowUp />
            <span>Post</span>
          </LoadingButton>
          <BorderedButton
            type="secondary"
            onClick={() => {
              setWord("");
              setDefinition("");
              setPartOfSpeech("");
            }}
            disabled={definition.length === 0}
          >
            <FaX />
            <span>Clear</span>
          </BorderedButton>
        </div>
        <p className="error-message">{postError}</p>
      </div>
      <div className={styles["definition-container"]}>
        <LoadableData loading={fetchLoading} error={fetchError}>
          {responses.flatMap((r, i) => {
            return r.meanings.flatMap((m, j) => {
              return m.definitions.map((d, k) => (
                <DefinitionView
                  key={`${i}-${j}-${k}`}
                  word={r.word}
                  definition={d.definition}
                  partOfSpeech={m.partOfSpeech}
                  selected={definition === d.definition}
                  onClick={() => {
                    setDefinition(d.definition);
                    setPartOfSpeech(m.partOfSpeech);
                    setWord(r.word);
                  }}
                />
              ));
            });
          })}
        </LoadableData>
      </div>
    </div>
  );
}

type DefinitionViewProps = {
  word: string;
  definition: string;
  partOfSpeech: string;
  selected: boolean;
  onClick: () => void;
};

function DefinitionView({
  word,
  definition,
  partOfSpeech,
  selected,
  onClick,
}: DefinitionViewProps) {
  return (
    <div
      onClick={onClick}
      className={`${styles.definition} ${selected ? styles.selected : ""}`}
    >
      <p className={styles["res-word"]}>{word}</p>
      <p className={styles["res-def"]}>{definition}</p>
      <p className={styles["res-pos"]}>{partOfSpeech}</p>
    </div>
  );
}
