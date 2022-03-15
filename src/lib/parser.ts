let imported = import.meta.globEager('./assets/pieces/*.{png,svg,jpg}')
let SAN = {};
for (let [key, value] of Object.entries(imported)) {
    SAN[key.match(/(\w+)\.\w+$/)[1]] = value.default;
}

function sanToFileName(sanString: string): string {
    // TODO: Make the pieces file name the san name
    let processed = sanString.toUpperCase() == sanString ? `w${sanString}` : `b${sanString.toUpperCase()}`
    return SAN[processed];
}
// export const FEN_RE = /([a-zA-Z1-9]+(?:\/[a-zA-Z1-9]+)*) ([wb]) ((?:K?Q?k?q?)|-) ((?:[a-z]\d+)|-) (\d+) (\d+)/
type Output = { src: string, san: string } | undefined
export function convert(str: string): Output[] {
    // Format:
    // DIMENSION SQUARES
    let [_, x] = str.split(' ');
    let output = [];
    [...x.match(/\d+|[a-zA-Z]/g)].forEach((c) => {
        if (/\d+/.test(c)) {
            output.push(...(Array(parseInt(c)).fill(undefined)));
        } else {
            output.push({ src: sanToFileName(c), san: c });
        }
    })
    return output
}
