export const removeTrailingSlash = (url: string) => {
	return url.replace(/\/$/, "");
};

export const removeFirstSlash = (url: string) => {
	return url.replace(/^\//, "");
};

export const getParentPath = (path: string) => {
	return removeFirstSlash(removeTrailingSlash(path))
		.split("/")
		.reduce((prev, cur, index, arr) => {
			if (index === 0) return cur;
			if (index == arr.length - 1) return prev;
			return prev + "/" + cur;
		}, "");
};
