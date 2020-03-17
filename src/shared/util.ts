import _ from "lodash"

export function isEqualBy<X, Y>(array1: X[], array2: Y[], comparator: (x: X, y: Y) => boolean): boolean {
	return array1.every((x, i) => comparator(x, array2[i]))
}