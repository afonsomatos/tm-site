import _ from "lodash"

export function isEqualBy<X, Y>(array1: X[], array2: Y[], comparator: (x: X, y: Y) => boolean) {
	return _.differenceWith(array1, array2, (a, b) => comparator(a, b)).length === 0
}