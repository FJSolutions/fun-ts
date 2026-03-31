/**
 * Checks is a supplied value is `null` or `undefined`, strictly (that is, not relying on truthy values).
 * @param value The value to check
 */
export const isNullOrUndefined = (value: unknown) => value === null || value === undefined

/**
 * Converts a string to a list of words, using the JavaScript `Intl` package to segment the string.
 * @param input The test to convert
 */
export const toWordList = (input: string | null | undefined) => {
   if (isNullOrUndefined(input)) return []

   const segmenter = new Intl.Segmenter([], {granularity: 'word'});
   const segmentedText = segmenter.segment(input);

   return [...segmentedText]
      .filter(s => s.isWordLike)
      .map(s => s.segment)
}

/**
 * Converts a string identifier to a list of words that can be converted into an identifier
 * @param input
 */
export const toIdentifierWordList = (input: string | null | undefined) =>
   toWordList(input)
      .flatMap(word => word.split(/[-_]/))
      .flatMap(word => word.split(/(?=[A-Z])/))
