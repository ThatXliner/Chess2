
const SEN = {
    "A": "wA",
    "B": "wB",
    "G": "wG",
    "J": "wJ",
    "K": "wK",
    "L": "wL",
    "N": "wN",
    "P": "wP",
    "Q": "wQ",
    "R": "wR",
    "W": "wW",
    "a": "bA",
    "b": "bB",
    "g": "bG",
    "j": "bJ",
    "k": "bK",
    "l": "bL",
    "n": "bN",
    "p": "bP",
    "q": "bQ",
    "r": "bR",
    "w": "bW",
}
function senToFileName(senString: string): string {
    return `/assets/pieces/${SEN[senString]}.png`;
}
export const FEN_RE = /([a-zA-Z1-9]+(?:\/[a-zA-Z1-9]+)*) ([wb]) ((?:K?Q?k?q?)|-) ((?:[a-z]\d+)|-) (\d+) (\d+)/
export function fenToArrayOfSquares(fenString: string): string[] {
    const match = fenString.match(FEN_RE);
    if (match == null) throw new Error(`Invalid FEN string: '${fenString}'`);
    let output = [];
    match[1].split('/').forEach((x) => {
        x.split(/(\d+|[a-zA-Z]+)/).forEach((c) => {
            if (c === '') return
            if (/\d+/.test(c)) {
                output.push(...(Array(parseInt(c)).fill(undefined)))
            } else {
                output.push(...([...c].map(senToFileName)))
            }
        })
    })
    return output
}
