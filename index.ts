/*
	Password Validator 0.1
	(c) 2007 Steven Levithan <stevenlevithan.com>
	MIT License
*/

// http://blog.stevenlevithan.com/archives/javascript-password-validator

console.log('TEST');

interface RegExps {
	lower:   RegExp,
	upper:   RegExp,
	alpha:   RegExp,
	numeric: RegExp,
	special: RegExp
}

interface Options {
	lower:    number,
	upper:    number,
	alpha:    number, /* lower + upper */
	numeric:  number,
	special:  number,
	length:   [number, number],
	//custom?:   [ /* regexes and/or functions */ ],
	badWords: string[],
	badSequenceLength: number,
	noQwertySequences: boolean,
	noSequential: boolean
}

interface Result {
	valid: boolean;
	message: string[];
}

function validatePassword (pw: string, options: Options): Result {
	// default options (allows any password)
	let o: Options = {
		lower:    0,
		upper:    0,
		alpha:    0, /* lower + upper */
		numeric:  0,
		special:  0,
		length:   [0, Infinity],
		//custom:   [ /* regexes and/or functions */ ],
		badWords: [],
		badSequenceLength: 0,
		noQwertySequences: false,
		noSequential:      false
	};

	let result: Result = {message:[], valid:true};
	
	let property: keyof Options;
	for (property in options) {
		o = {...o, [property]: options[property]};
	}

	let	re: RegExps = {
			lower:   /[a-z]/g,
			upper:   /[A-Z]/g,
			alpha:   /[A-Z]/gi,
			numeric: /[0-9]/g,
			special: /[\W_]/g
		}, i;

	// enforce min/max length
	if (pw.length < o.length[0] || pw.length > o.length[1]) {
		result.valid = false;
		result.message.push(`La longitud mínima es ${o.length[0]}`);
		result.message.push(`La longitud máxima es ${o.length[1]}`);
		return result;
	}

	// enforce lower/upper/alpha/numeric/special rules
	let rule: keyof RegExps;
	for (rule in re) {
		if ((pw.match(re[rule]) || []).length < o[rule] ) {
			result.valid = false;
			result.message.push(`Debe tener al menos ${o[rule]} ${rule}`);
			return result;
		}
	}

	// enforce word ban (case insensitive)
	for (i = 0; i < o.badWords.length; i++) {
		if (pw.toLowerCase().indexOf(o.badWords[i].toLowerCase()) > -1) {
			result.valid = false;
			result.message.push(`Contiene una palabra prohibida ${o.badWords[i]}`);
			return result;
		}
	}

	// enforce the no sequential, identical characters rule
	if (o.noSequential && /([\S\s])\2/.test(pw)) {
		result.valid = false;
		result.message.push(`Contiene una secuencia identica no permitida`);
		return result;
	}

	// enforce alphanumeric/qwerty sequence ban rules
	if (o.badSequenceLength) {
		let	lower   = "abcdefghijklmnñopqrstuvwxyz",
			lowerReverse = lower.split("").reverse().join(""),
			upper   = lower.toUpperCase(),
			upperReverse   = lowerReverse.toUpperCase(),
			numbers = "0123456789",
			numbersReverse = numbers.split("").reverse().join(""),
			// qwerty  = "qwertyuiopasdfghjklzxcvbnm",
			start   = o.badSequenceLength - 1,
			seq     = "_" + pw.slice(0, start);
		for (i = start; i < pw.length; i++) {
			seq = seq.slice(1) + pw.charAt(i);
			if (
				lower.indexOf(seq)   > -1 ||
				upper.indexOf(seq)   > -1 ||
				numbers.indexOf(seq) > -1 ||
				lowerReverse.indexOf(seq) > -1 ||
				upperReverse.indexOf(seq) > -1 ||
				numbersReverse.indexOf(seq) > -1
				// || (o.noQwertySequences && qwerty.indexOf(seq) > -1)
			) {
				result.valid = false;
				result.message.push(`Contiene una secuencia no permitida ${seq}`);
				return result;
			}
		}
	}

	// enforce custom regex/function rules
	// for (i = 0; i < o.custom.length; i++) {
	// 	rule = o.custom[i];
	// 	if (rule instanceof RegExp) {
	// 		if (!rule.test(pw))
	// 			return false;
	// 	} else if (rule instanceof Function) {
	// 		if (!rule(pw))
	// 			return false;
	// 	}
	// }

	// great success!
	return result;
}

// let password = "0609702abc";
/*
var passed = validatePassword(password, {
	length:   [8, Infinity],
	lower:    0,
	upper:    0,
	numeric:  1,
	special:  1,
	badWords: ["password", "steven", "levithan"],
	badSequenceLength: 4
});
*/
let password = "20222016098702abcC";
//let password = "Intercam123";
let passed = validatePassword(password, {
	lower: 0,
	upper: 0,
	alpha: 0,
	numeric: 0,
	special: 0,
	length:   [6, Infinity],
	noQwertySequences: true,
	noSequential:     true,
	badSequenceLength: 3,
	badWords: ["password", "Intercam", "bolsa"]
});



// document.getElementById("test").innerHTML = passed;
console.log(passed.valid, passed.message.join(" "));