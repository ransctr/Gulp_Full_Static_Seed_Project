// *** Helper *** 
//Remove spaces and transform to lowercase
module.exports.filename = function (str) {
	let lower = str ? str.replace(/ +/g, '-').toLowerCase() : "";
	return lower;
}