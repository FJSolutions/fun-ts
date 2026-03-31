import { isNullOrUndefined, toIdentifierWordList, toWordList } from "./utils";

/**
 * Converts the input to upper case
 * @param input A string to convert
 */
export const toUpper = (input: string | null | undefined) => {
   if (isNullOrUndefined(input)) return ""
   return input.toLocaleUpperCase()
}

/**
 * Converts the input to lower case
 * @param input A string to convert
 */
export const toLower = (input: string | null | undefined) => {
   if (isNullOrUndefined(input)) return ""
   return input.toLocaleLowerCase()
}

/**
 * Converts a string of one or more words to a string of capitalised words
 * @param input
 */
export const capitalise = (input: string | null | undefined) =>
   toWordList(input)
      .map(word => toUpper(word[0]) + word.slice(1)).join(" ")

/**
 * Converts a string to sentence case, capitalising only the first letter of the first word
 * @param input
 */
export const toSentence = (input: string | null | undefined) => {
   const words = toWordList(input)
   if (words.length === 0) return ""
   else if (words.length === 1) return capitalise(words[0])
   else return capitalise(words[0]) + " " + words.slice(1).join(" ")
}

/**
 * Converts an input identifier to a Pascal case identifier
 * @param identifier The input identifier
 */
export const toPascal = (identifier: string | null | undefined) =>
   toIdentifierWordList(identifier)
      .map(word => capitalise(word))
      .join("")

/**
 * Converts an input identifier to a Camel case identifier
 * @param identifier The input identifier
 */
export const toCamel = (identifier: string | null | undefined) => {
   const words = toIdentifierWordList(identifier)
   if (words.length === 0) return ""
   else if (words.length === 1) return toLower(words[0])

   return toLower(words[0]) + words.slice(1).map(word => capitalise(word)).join("")
}

/**
 * Converts an input identifier to a snake_case
 * @param identifier The input identifier
 */
export const toSnake = (identifier: string | null | undefined) =>
   toIdentifierWordList(identifier).map(word => toLower(word)).join("_")

/**
 * Converts an input identifier to a kebab-case
 * @param identifier The input identifier
 */
export const toKebab = (identifier: string | null | undefined) =>
   toIdentifierWordList(identifier).map(word => toLower(word)).join("-")

