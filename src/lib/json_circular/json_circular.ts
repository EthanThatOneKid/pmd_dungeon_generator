function circularReplacer() {
	// Creating new WeakSet to keep
	// track of previously seen objects
	const seen = new WeakSet();

	return (_: string, value: unknown) => {
		// If type of value is an
		// object or value is null
		if (typeof value === 'object' && value !== null) {
			// If it has been seen before
			if (seen.has(value)) {
				return '[Circular]';
			}

			// Add current value to the set
			seen.add(value);
		}

		// return the value
		return value;
	};
}

export function stringify(obj: unknown, space?: string | number | undefined): string {
	return JSON.stringify(obj, circularReplacer(), space);
}
