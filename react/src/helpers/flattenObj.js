const flattenObject = (ob) => {
	const toReturn = {};
	
	for (let i in ob) {
		if (!ob.hasOwnProperty(i)) continue;
		
		if ((typeof ob[i]) == 'object') {
			let flatObject = flattenObject(ob[i]);
			for (let x in flatObject) {
				if (!flatObject.hasOwnProperty(x)) continue;
				
				toReturn[x] = flatObject[x];
			}
		} else {
			toReturn[i] = ob[i];
		}
	}
	return toReturn;
};

export default flattenObject;