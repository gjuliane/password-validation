/*
	Password Validator 0.1
	(c) 2007 Steven Levithan <stevenlevithan.com>
	MIT License
*/

// http://blog.stevenlevithan.com/archives/javascript-password-validator
//Modificado y extendido para TypeScript por @gjuliane

/**
 * Interface for store regular expresions 
 * that will be used to check neededs characters
 * depending of size specified by user and existence of it
 */
interface RegExps {
	lower:   RegExp,
	upper:   RegExp,
	alpha:   RegExp,
	numeric: RegExp,
	special: RegExp
}

/**
 * Options configurations to check the password
 */
interface Options {
	lower:    number, // zero for not check or the size for uccurrences of lowers
	upper:    number, // zero for not check or the size for uccurrences of uppers
	alpha:    number, /* lower + upper */ // zero for not check or the size for uccurrences of alphas
	numeric:  number, // zero for not check or the size for uccurrences of uppers
	special:  number, // zero for not check or the size for uccurrences of non words it means symbols
	length:   [number, number], // min, max limitation
	//custom?:   [ /* regexes and/or functions */ ],
	badWords: string[], // array of string for incorrect words
	badSequenceLength: number, // size limit of incorrect sequences 
	noQwertySequences: boolean, // activate or not qwerty ckecks
	noSequential: boolean // to check secuentials harcoded to 2 characters
}
/**
 * Interface to store the test result
 */
interface Result {
	valid: boolean;	// Valid or not
	message: string[]; // In case of password is incorrect
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
		o = {...o, [property]: options[property]}; //destructuring the user options
	}

	let	re: RegExps = {
			lower:   /[a-z]/g,
			upper:   /[A-Z]/g,
			alpha:   /[A-Z]/gi,
			numeric: /[0-9]/g,
			special: /[\W_]/g
		}
	let i: number;

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
	if (o.noSequential && /([\S\s])\1{2}/gd.test(pw)) {
		const noSeqResult = pw.match(/([\S\s])\1{2}/)
		result.valid = false;
		if (noSeqResult != null) {
			result.message.push(`Contiene una secuencia identica no permitida "${noSeqResult[0]}"`);
		} else {
			result.message.push(`Contiene una secuencia identica no permitida`);
		}
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
			qwerty  = "qwertyuiopasdfghjklñzxcvbnm",
			toLower = lower+lowerReverse,
			start   = o.badSequenceLength - 1,
			seq     = "_" + pw.slice(0, start);
		for (i = start; i < pw.length; i++) {
			seq = seq.slice(1) + pw.charAt(i);
			let seqName = "";
			if (
				lower.indexOf(seq)   > -1 && (seqName='lower')=="lower" ||
				upper.indexOf(seq)   > -1 && (seqName='upper')=="upper" ||
				numbers.indexOf(seq) > -1 && (seqName='numbers')=="numbers" ||
				lowerReverse.indexOf(seq) > -1 && (seqName='lowerReverse')=="lowerReverse" ||
				upperReverse.indexOf(seq) > -1 && (seqName='upperReverse')=="upperReverse" ||
				numbersReverse.indexOf(seq) > -1 && (seqName='numbersReverse')=="numbersReverse" ||
				(o.noQwertySequences && qwerty.indexOf(seq) > -1 && (seqName='qwerty')=="qwerty") ||
				toLower.indexOf(seq.toLowerCase()) > -1 &&( seqName='toLower')=="toLower"
			) {
				result.valid = false;
				result.message.push(`Contiene una secuencia no permitida ${seqName} ${seq}`);
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

	// Here we are, password valid
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
// let password = "11baaa2ab0022201609802bcCInteraBancoinercamqwe";
let userName = 'UTAPIA';
let passwords: string[] = [
	'aaa',
	'N3wBl00d13#',
	'password',
	'Intercam1#',
	'abCddsadkjklj',
	'2022Ab$988765',
	'',
	'qwertyuio',
	'0123456789',
	'0987654321',
	'889900665544433',
	'1ntercam#1',
	'12utapia)($$%%%',
	'_´+{ ewewdfs'
];
let badWords = ["password", "Intercam", "bolsa"];
badWords.push(userName);
//let password = "Intercam123";

passwords.forEach(password => {
	let passed = validatePassword(password, {
		lower: 0,
		upper: 0,
		alpha: 0,
		numeric: 0,
		special: 0,
		length:   [8, 256],
		noQwertySequences: true,
		noSequential:     true,
		badSequenceLength: 3,
		badWords: badWords
	});
	console.log(password,'\t',passed.valid, passed.message.join(" "));
});