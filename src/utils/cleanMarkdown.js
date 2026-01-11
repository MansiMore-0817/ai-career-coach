export function cleanMarkdown(text) {
  return text
    .replace(/[*_`#>-]/g, "")        // remove markdown symbols
    .replace(/\n+/g, "\n")           // normalize spacing
    .trim();
}
export function formatMessage(text) {
  return text
    .replace(/\*\*/g, "")               // remove bold markers
    .replace(/#+\s?/g, "")              // remove headings ##
    .replace(/-\s+/g, "• ")             // convert bullet dash → bullet dot
    .replace(/\n{2,}/g, "\n")           // collapse blank lines
    .trim();
}
