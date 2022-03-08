let imported = import.meta.globEager('./assets/pieces/*.{png,svg,jpg}')
let SEN = {};
for (let [key, value] of Object.entries(imported)) {
    SEN[key.match(/(\w+)\.\w+$/)[1]] = value.default;
}

function senToFileName(senString: string): string {
    // TODO: Make the pieces file name the sen name
    let processed = senString.toUpperCase() == senString ? `w${senString}` : `b${senString.toUpperCase()}`
    return SEN[processed];
}
export const FEN_RE = /([a-zA-Z1-9]+(?:\/[a-zA-Z1-9]+)*) ([wb]) ((?:K?Q?k?q?)|-) ((?:[a-z]\d+)|-) (\d+) (\d+)/
type Output = { src: string, sen: string } | undefined
export function fenToArrayOfSquares(fenString: string): Output[] {
    const match = fenString.match(FEN_RE);
    if (match == null) throw new Error(`Invalid FEN string: '${fenString}'`);
    let output = [];
    match[1].split('/').forEach((x) => {
        if (/\d+/.test(x)) {
                output.push(...(Array(parseInt(x)).fill(undefined)));
                return;
        }
        x.split(/(\d+|[a-zA-Z])/).forEach((c) => {
            if (c === '') return;
            if (/\d+/.test(c)) {
                output.push(...(Array(parseInt(c)).fill(undefined)));
            } else {
                output.push({ src: senToFileName(c), sen: c });
            }
        })
    })
    return output
}
