import { Definition, FetchedDefinition } from "./types";

export function parseDefinitions(
  definitions: FetchedDefinition[]
): Definition[] {
  if (!definitions) {
    return [];
  }

  let parsedDefinitions: Definition[] = [];
  for (const rootDefinition of definitions) {
    for (const meaning of rootDefinition.meanings) {
      for (const definition of meaning.definitions) {
        parsedDefinitions.push({
          word: rootDefinition.word,
          definition: definition.definition,
          example: definition.example,
          synonyms: definition.synonyms,
          antonyms: definition.antonyms,
          origin: rootDefinition.origin,
          partOfSpeech: meaning.partOfSpeech,
        });
      }
    }
  }
  return parsedDefinitions;
}
