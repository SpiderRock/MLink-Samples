class queryParameterGenerator {
  parseAndEncodeFilter(rawFilter: string) {
    const encodedFilter = encodeURIComponent(rawFilter);
    return encodedFilter;
  }
}

export const QueryParameterGenerator = new queryParameterGenerator();

export default QueryParameterGenerator;
