export const getFullPath = (...args: string[]) => {
	return args.join('/');
};

export const getParamsString = (...args: string[]) => {
	if (!args.join().length) return ''
	return '?'+ args.filter(it=>it).join("&")
}