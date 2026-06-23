import {
  createSearchParamsCache,
  createSerializer,
  type ParserMap,
  parseAsInteger,
  parseAsString,
} from "nuqs/server";

export const commonListSearchParamParsers = {
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
  search: parseAsString,
};

export function createListSearchParams<TParsers extends ParserMap>(
  extraParsers: TParsers
) {
  const parsers = {
    ...commonListSearchParamParsers,
    ...extraParsers,
  };

  return {
    parsers,
    cache: createSearchParamsCache(parsers),
    serializer: createSerializer(parsers),
  };
}
