export function extractQueryParams(url) {
  try {
    if (!url) throw new Error("Expected URL not to be empty.")

    const rgxKeyValue = /\\?(?<key>[a-zA-Z0-9\. ]+)=(?<value>[a-zA-Z0-9\. ]*)/g

    const entries = Array.from(url.matchAll(rgxKeyValue) || [])?.map(v => v.groups)

    if (!entries?.length) throw new Error("No params found")

    return Object.fromEntries(entries.map(({ key, value }) => [key, value]))
  } catch (error) {
    return {}
  }
}