import { Definition, FetchedDefinition } from "./types";

export function parseDefinitions(
  definitions: FetchedDefinition[]
): Definition[] {
  if (!definitions) {
    return [];
  }

  return definitions.flatMap((rootDefinition) =>
    rootDefinition.meanings.flatMap((meaning) =>
      meaning.definitions.map((definition) => ({
        word: rootDefinition.word,
        definition: definition.definition,
        example: definition.example,
        synonyms: definition.synonyms,
        antonyms: definition.antonyms,
        origin: rootDefinition.origin,
        partOfSpeech: meaning.partOfSpeech,
      }))
    )
  );
}