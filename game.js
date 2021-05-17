/*








WARNING: looking at this source code (especially before you first play through the game) may significantly hurt your experience!









*/

if (sessionStorage.getItem("facilities") == null) {
	window.open("index.html", "_self");
}
const COUNT = (12 ** 2);
function toPercent(n) {
	return parseFloat(n).toFixed(5) + "%";
}
function toPlaces(n, x, q = false) {
	return (((q && n > 0) ? "+" : 0) + Math.round((n + Number.EPSILON) * (10 ** x)) / (10 ** x));
}
function toShort(z, x, q = false) {
	if (Math.abs(z) < 1000) {
		return toPlaces(z, 0);
	} else {
		var n = toPlaces(z, x);
		if (z < 0) { n = -1 * z }
		x = Math.pow(10, x);
	    var a = ["K", "M", "B", "T"];
	    for (var i = a.length - 1; i >= 0; i--) {
	        var s = Math.pow(10, (i + 1) * 3);
	        if (s <= n) {
	             n = Math.round(n * x / s) / x;
	             if ((n == 1000) && (i < a.length - 1)) {
	                 n = 1;
	                 i++;
	             }
	             n += a[i];
	             break;
	        }
	    }
	    if (z < 0) {
	    	return ("-" + n);
	    } else if (q) {
	    	return ("+" + n);
	    } else {
	    	return n;
	    }
	}
}
function toDate(d) {
	return ((d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1)) + "/" + (d.getDate() < 10 ? "0" + d.getDate() : d.getDate()) + "/" + d.getFullYear().toString().substring(2));
}

var name = sessionStorage.getItem("company");
const initial = Number(sessionStorage.getItem("initial"));
var eff = 0;
var cleared = [];
var countries = 0;
var events = [
	{
		"desc": "USA: Multiple states lift lockdown measures",
		"d0": (new Date("September 1, 2020")),
		"c0": 0.02,
		"ct": 0.005,
		"effects": [
			{ "country": "usa", "t": "b", "v": 0.215 }
		],
		"e_effects": []
	},
	{
		"desc": "USA: Travelers largely ignore CDC do-not-travel Thanksgiving warnings",
		"d0": (new Date("November 26, 2020")),
		"c0": 1,
		"ct": 0,
		"effects": [
			{ "country": "usa", "t": "b", "v": 0.225 }
		],
		"e_effects": []
	},
	{
		"desc": "Christmas season sees huge increase in air travel",
		"d0": (new Date("December 15, 2020")),
		"c0": 1,
		"ct": 0,
		"effects": [
			{ "country": "usa", "t": "b", "v": 0.235 },
			{ "country": "bra", "t": "b", "v": 0.155 },
			{ "country": "rus", "t": "b", "v": 0.18 },
			{ "country": "gbr", "t": "b", "v": 0.27 },
			{ "country": "gbr", "t": "bt", "v": -0.0053667 },
			{ "country": "esp", "t": "b", "v": 0.21 },
			{ "country": "ita", "t": "b", "v": 0.2 },
			{ "country": "fra", "t": "b", "v": 0.2065 },
			{ "country": "deu", "t": "b", "v": 0.2063 },
			{ "country": "per", "t": "b", "v": 0.1671 },
			{ "country": "chl", "t": "b", "v": 0.23 },
			{ "country": "chl", "t": "bt", "v": -0.0004667 },
			{ "country": "mex", "t": "b", "v": 0.17 },
			{ "country": "can", "t": "b", "v": 0.24 },
			{ "country": "can", "t": "bt", "v": -0.001667 }
		],
		"e_effects": []
	},
	{
		"desc": "",
		"d0": (new Date("November 1, 2020")),
		"c0": 0.05,
		"ct": 0.01,
		"effects": [
			{ "country": "bra", "t": "b", "v": 0.155 },
			{ "country": "bra", "t": "bt", "v": -0.00006667 }
		],
		"e_effects": [
			{
				"desc": "Brazil: Second wave begins spreading",
				"d0": 7,
				"c0": 1,
				"ct": 0,
				"effects": [],
				"e_effects": []
			}
		]
	},
	{
		"desc": "Russia: Most air travel restrictions lifted",
		"d0": (new Date("August 20, 2020")),
		"c0": 0.04,
		"ct": 0.005,
		"effects": [
			{ "country": "rus", "t": "b", "v": 0.2 },
			{ "country": "rus", "t": "bt", "v": -0.0003667 }
		],
		"e_effects": []
	},
	{
		"desc": "UK: Social distancing rules relaxed",
		"d0": (new Date("August 1, 2020")),
		"c0": 0.04,
		"ct": 0.015,
		"effects": [
			{ "country": "gbr", "t": "b", "v": 0.295 },
			{ "country": "gbr", "t": "bt", "v": -0.0010667 }
		],
		"e_effects": []
	},
	{
		"desc": "",
		"d0": (new Date("July 18, 2020")),
		"c0": 0.05,
		"ct": 0.01,
		"effects": [
			{ "country": "esp", "t": "b", "v": 0.28 },
			{ "country": "esp", "t": "bt", "v": -0.0009367 }
		],
		"e_effects": [
			{
				"desc": "Spain: Alarm at surge in cases; government blames young people partying",
				"d0": 7,
				"c0": 1,
				"ct": 0,
				"effects": [],
				"e_effects": []
			}
		]
	},
	{
		"desc": "",
		"d0": (new Date("August 10, 2020")),
		"c0": 0.04,
		"ct": 0.01,
		"effects": [
			{ "country": "ita", "t": "b", "v": 0.28 },
			{ "country": "ita", "t": "bt", "v": -0.0010367 },
			{ "country": "fra", "t": "b", "v": 0.2925 },
			{ "country": "fra", "t": "bt", "v": -0.0013367 },
			{ "country": "deu", "t": "b", "v": 0.2925 },
			{ "country": "deu", "t": "bt", "v": -0.0013367 }
		],
		"e_effects": [
			{
				"desc": "European countries experience second wave of infections",
				"d0": 7,
				"c0": 1,
				"ct": 0,
				"effects": [],
				"e_effects": []
			}
		]
	},
	{
		"desc": "",
		"d0": (new Date("February 25, 2021")),
		"c0": 0.04,
		"ct": 0.01,
		"effects": [
			{ "country": "ita", "t": "b", "v": 0.22 },
		],
		"e_effects": [
			{
				"desc": "Italy: Concerning new wave of cases",
				"d0": 7,
				"c0": 1,
				"ct": 0,
				"effects": [],
				"e_effects": []
			}
		]
	},
	{
		"desc": "India: Major religious festivals take place",
		"d0": (new Date("March 30, 2021")),
		"c0": 1,
		"ct": 0,
		"effects": [
			{ "country": "ind", "t": "b", "v": 0.19 },
			{ "country": "ind", "t": "bt", "v": -0.000533 }
		],
		"e_effects": []
	},
	{
		"desc": "India: Major religious festivals take place",
		"d0": (new Date("March 30, 2022")),
		"c0": 1,
		"ct": 0,
		"effects": [
			{ "country": "ind", "t": "b", "v": 0.19 },
			{ "country": "ind", "t": "bt", "v": -0.000533 }
		],
		"e_effects": []
	},
	{
		"desc": "Peru: Government announces reopening of businesses in key industries",
		"d0": (new Date("July 12, 2020")),
		"c0": 0.03,
		"ct": 0.0025,
		"effects": [
			{ "country": "per", "t": "b", "v": 0.166 }
		],
		"e_effects": []
	},
	{
		"desc": "Turkey: Tourism resumed and public spaces reopened",
		"d0": (new Date("June 3, 2020")),
		"c0": 0.01,
		"ct": 0.01,
		"effects": [],
		"e_effects": [
			{
				"desc": "",
				"d0": 140,
				"c0": 0.05,
				"ct": 0.01,
				"effects": [
					{ "country": "tur", "t": "b", "v": 0.2475 },
					{ "country": "tur", "t": "bt", "v": -0.001333 }
				],
				"e_effects": [
					{
					"desc": "Turkey: Istanbul, Ankara mayors admit that reopening was a mistake",
					"d0": 14,
					"c0": 1,
					"ct": 0,
					"effects": [],
					"e_effects": []
					}
				]
			}
		]
	},
	{
		"desc": "Turkey: Federal government eases business restrictions again",
		"d0": (new Date("March 5, 2021")),
		"c0": 0.04,
		"ct": 0.01,
		"effects": [
			{ "country": "tur", "t": "b", "v": 0.225 },
		],
		"e_effects": []
	},
	{
		"desc": "Iran: Education minister opens schools despite warnings from medical professionals",
		"d0": (new Date("September 1, 2020")),
		"c0": 0.04,
		"ct": 0.01,
		"effects": [],
		"e_effects": [
			{
				"desc": "",
				"d0": 50,
				"c0": 0.06,
				"ct": 0.01,
				"effects": [
					{ "country": "irn", "t": "b", "v": 0.184 },
					{ "country": "irn", "t": "bt", "v": -0.000267 }
				],
				"e_effects": [
					{
					"desc": "Iran: Legislators call for education minister's resignation after surge in cases",
					"d0": 14,
					"c0": 1,
					"ct": 0,
					"effects": [],
					"e_effects": []
					}
				]
			}
		]
	},
	{
		"desc": "Chile: Casinos and schools reopened",
		"d0": (new Date("February 18, 2021")),
		"c0": 0.05,
		"ct": 0.02,
		"effects": [
			{ "country": "chl", "t": "b", "v": 0.185 },
		],
		"e_effects": []
	},
	{
		"desc": "",
		"d0": (new Date("September 1, 2020")),
		"c0": 0.04,
		"ct": 0.005,
		"effects": [
			{ "country": "can", "t": "b", "v": 0.26 },
			{ "country": "can", "t": "bt", "v": -0.000667 }
		],
		"e_effects": [
			{
				"desc": "Canada: Second wave of cases underway",
				"d0": 14,
				"c0": 1,
				"ct": 0,
				"effects": [],
				"e_effects": []
			}
		]
	},
	{
		"desc": "Saudi Arabia: Mosques now permitted to deliver in-person sermons",
		"d0": (new Date("March 20, 2021")),
		"c0": 0.05,
		"ct": 0.02,
		"effects": [
			{ "country": "sau", "t": "b", "v": 0.18 },
			{ "country": "sau", "t": "bt", "v": -0.0003667 }
		],
		"e_effects": []
	},
	{
		"desc": "Pakistan: Large-scale gatherings resume as people believe risk to have lowered",
		"d0": (new Date("July 15, 2020")),
		"c0": 0.04,
		"ct": 0.01,
		"effects": [],
		"e_effects": [
			{
				"desc": "",
				"d0": 90,
				"c0": 0.06,
				"ct": 0.01,
				"effects": [
					{ "country": "pak", "t": "b", "v": 0.18 },
					{ "country": "pak", "t": "bt", "v": -0.0003667 }
				],
				"e_effects": [
					{
					"desc": "Pakistan: New surge in cases",
					"d0": 21,
					"c0": 1,
					"ct": 0,
					"effects": [],
					"e_effects": []
					}
				]
			}
		]
	},
	{
		"desc": "Christmas season sees huge increase in air travel",
		"d0": (new Date("December 15, 2021")),
		"c0": 1,
		"ct": 0,
		"effects": [
			{ "country": "usa", "t": "b", "v": 0.235 },
			{ "country": "bra", "t": "b", "v": 0.155 },
			{ "country": "rus", "t": "b", "v": 0.18 },
			{ "country": "gbr", "t": "b", "v": 0.27 },
			{ "country": "gbr", "t": "bt", "v": -0.0053667 },
			{ "country": "esp", "t": "b", "v": 0.21 },
			{ "country": "ita", "t": "b", "v": 0.2 },
			{ "country": "fra", "t": "b", "v": 0.2065 },
			{ "country": "deu", "t": "b", "v": 0.2063 },
			{ "country": "per", "t": "b", "v": 0.1671 },
			{ "country": "chl", "t": "b", "v": 0.23 },
			{ "country": "chl", "t": "bt", "v": -0.0004667 },
			{ "country": "mex", "t": "b", "v": 0.17 },
			{ "country": "can", "t": "b", "v": 0.24 },
			{ "country": "can", "t": "bt", "v": -0.001667 }
		],
		"e_effects": []
	},
	{
		"desc": "Christmas season sees huge increase in air travel",
		"d0": (new Date("December 15, 2022")),
		"c0": 1,
		"ct": 0,
		"effects": [
			{ "country": "usa", "t": "b", "v": 0.235 },
			{ "country": "bra", "t": "b", "v": 0.155 },
			{ "country": "rus", "t": "b", "v": 0.18 },
			{ "country": "gbr", "t": "b", "v": 0.27 },
			{ "country": "gbr", "t": "bt", "v": -0.0053667 },
			{ "country": "esp", "t": "b", "v": 0.21 },
			{ "country": "ita", "t": "b", "v": 0.2 },
			{ "country": "fra", "t": "b", "v": 0.2065 },
			{ "country": "deu", "t": "b", "v": 0.2063 },
			{ "country": "per", "t": "b", "v": 0.1671 },
			{ "country": "chl", "t": "b", "v": 0.23 },
			{ "country": "chl", "t": "bt", "v": -0.0004667 },
			{ "country": "mex", "t": "b", "v": 0.17 },
			{ "country": "can", "t": "b", "v": 0.24 },
			{ "country": "can", "t": "bt", "v": -0.001667 }
		],
		"e_effects": []
	},
	{
		"desc": "USA: Large-scale 4th of July celebrations take place with minimal social distancing",
		"d0": (new Date("July 4, 2021")),
		"c0": 1,
		"ct": 0,
		"effects": [
			{ "country": "usa", "t": "b", "v": 0.225 }
		],
		"e_effects": []
	},
	{
		"desc": "China: Train stations packed with Chinese New Year travelers",
		"d0": (new Date("January 31, 2022")),
		"c0": 1,
		"ct": 0,
		"effects": [
			{ "country": "chn", "t": "b", "v": 0.225 },
			{ "country": "chn", "t": "bt", "v": -0.0005 }
		],
		"e_effects": []
	},
	{
		"desc": "Saudi Arabia: Government lifts restrictions on Hajj travels",
		"d0": (new Date("July 12, 2021")),
		"c0": 1,
		"ct": 0,
		"effects": [
			{ "country": "sau", "t": "b", "v": 0.2 }
		],
		"e_effects": []
	},
	{
		"desc": "Saudi Arabia: Hajj takes place",
		"d0": (new Date("July 12, 2022")),
		"c0": 1,
		"ct": 0,
		"effects": [
			{ "country": "sau", "t": "b", "v": 0.2 }
		],
		"e_effects": []
	},
	{
		"desc": "Mexico: Under enormous economic pressure, government signs agreement with US to reopen border",
		"d0": (new Date("September 13, 2021")),
		"c0": 0.04,
		"ct": 0.002,
		"effects": [
			{ "country": "mex", "t": "b", "v": 0.18 },
		],
		"e_effects": []
	}
]

var money = 0;
var dmoney = 0;
var data = {
    usa: {
        "country": "United States",
        "id": "USA",
        "pop": 328239520,
        "cc": 1820000,
        "pcc": 0.0055447314814498876,
        "cd": 108610,
        "nc": 21897,
        "nd": 776,
        "b": 0.23,
        "k": 0.2,
        "bt": -0.00031667,
        "d": 0.0154,
        "cash": 10,
        "demonym": "American",
        "ks": "A",
        "kc": 65,
        "leader": "president"
    },
    bra: {
        "country": "Brazil",
        "id": "BRA",
        "pop": 211049530,
        "cc": 526477,
        "pcc": 0.0024945660859799117,
        "cd": 29937,
        "nc": 11598,
        "nd": 623,
        "b": 0.174,
        "k": 0.1429,
        "bt": -0.00031667,
        "d": 0.034,
        "cash": 8,
        "demonym": "Brazilian",
        "ks": "B",
        "kc": 66,
        "leader": "president"
    },
    rus: {
        "country": "Russia",
        "id": "RUS",
        "pop": 144406260,
        "cc": 414328,
        "pcc": 0.0028691830949710904,
        "cd": 4849,
        "nc": 8485,
        "nd": 156,
        "b": 0.16,
        "k": 0.1667,
        "bt": -0.00000667,
        "d": 0.0251,
        "cash": 8,
        "demonym": "Russian",
        "ks": "R",
        "kc": 82,
        "leader": "president"
    },
    gbr: {
        "country": "United Kingdom",
        "id": "GBR",
        "pop": 66836330,
        "cc": 258983,
        "pcc": 0.003874883614944148,
        "cd": 37613,
        "nc": 1444,
        "nd": 86,
        "b": 0.18,
        "k": 0.2,
        "bt": 0,
        "d": 0.0153,
        "cash": 10,
        "demonym": "British",
        "ks": "K",
        "kc": 75,
        "leader": "prime minster"
    },
    esp: {
        "country": "Spain",
        "id": "ESP",
        "pop": 47133520,
        "cc": 239638,
        "pcc": 0.005084237290149346,
        "cd": 27127,
        "nc": 159,
        "nd": 0,
        "b": 0.175,
        "k": 0.18,
        "bt": 0,
        "d": 0.0203,
        "cash": 8,
        "demonym": "Spanish",
        "ks": "E",
        "kc": 69,
        "leader": "president"
    },
    ita: {
        "country": "Italy",
        "id": "ITA",
        "pop": 60302090,
        "cc": 233197,
        "pcc": 0.0038671462299233743,
        "cd": 33475,
        "nc": 200,
        "nd": 60,
        "b": 0.18,
        "k": 0.18,
        "bt": 0,
        "d": 0.021,
        "cash": 8,
        "demonym": "Italian",
        "ks": "L",
        "kc": 76,
        "leader": "president"
    },
    ind: {
        "country": "India",
        "id": "IND",
        "pop": 1366417750,
        "cc": 198370,
        "pcc": 0.000145175221852907,
        "cd": 5608,
        "nc": 7761,
        "nd": 200,
        "b": 0.18,
        "k": 0.1429,
        "bt": -0.000325,
        "d": 0.024,
        "cash": 8,
        "demonym": "Indian",
        "ks": "N",
        "kc": 78,
        "leader": "prime minister"
    },
    fra: {
        "country": "France",
        "id": "FRA",
        "pop": 67055850,
        "cc": 191382,
        "pcc": 0.002854068660676138,
        "cd": 28837,
        "nc": 407,
        "nd": 32,
        "b": 0.179,
        "k": 0.18,
        "bt": 0,
        "d": 0.0202,
        "cash": 10,
        "demonym": "French",
        "ks": "F",
        "kc": 70,
        "leader": "president"
    },
    deu: {
        "country": "Germany",
        "id": "DEU",
        "pop": 83092960,
        "cc": 183594,
        "pcc": 0.0022095012622007928,
        "cd": 8555,
        "nc": 184,
        "nd": 15,
        "b": 0.179,
        "k": 0.18,
        "bt": 0,
        "d": 0.0211,
        "cash": 10,
        "demonym": "German",
        "ks": "G",
        "kc": 71,
        "leader": "chancellor"
    },
    per: {
        "country": "Peru",
        "id": "PER",
        "pop": 32510450,
        "cc": 170039,
        "pcc": 0.005230287492175593,
        "cd": 4634,
        "nc": 5563,
        "nd": 128,
        "b": 0.135,
        "k": 0.145,
        "bt": -0.00031667,
        "d": 0.0345,
        "cash": 6,
        "demonym": "Peruvian",
        "ks": "U",
        "kc": 85,
        "leader": "president"
    },
    tur: {
        "country": "Turkey",
        "id": "TUR",
        "pop": 83429620,
        "cc": 164769,
        "pcc": 0.0019749460683148264,
        "cd": 4563,
        "nc": 827,
        "nd": 23,
        "b": 0.167,
        "k": 0.167,
        "bt": 0.0000887,
        "d": 0.017,
        "cash": 6,
        "demonym": "Turkish",
        "ks": "T",
        "kc": 84,
        "leader": "president"
    },
    irn: {
        "country": "Iran",
        "id": "IRN",
        "pop": 82913910,
        "cc": 154445,
        "pcc": 0.001862715194591595,
        "cd": 7878,
        "nc": 2979,
        "nd": 81,
        "b": 0.153,
        "k": 0.153,
        "bt": 0.000013,
        "d": 0.0304,
        "cash": 6,
        "demonym": "Iranian",
        "ks": "I",
        "kc": 73,
        "leader": "president"
    },
    chl: {
        "country": "Chile",
        "id": "CHL",
        "pop": 18952040,
        "cc": 129020,
        "pcc": 0.006807710410066673,
        "cd": 1113,
        "nc": 5470,
        "nd": 59,
        "b": 0.157,
        "k": 0.1667,
        "bt": 0,
        "d": 0.025,
        "cash": 6,
        "demonym": "Chilean",
        "ks": "H",
        "kc": 72,
        "leader": "president"
    },
    mex: {
        "country": "Mexico",
        "id": "MEX",
        "pop": 127575530,
        "cc": 93435,
        "pcc": 0.0007323896675169604,
        "cd": 10167,
        "nc": 2771,
        "nd": 237,
        "b": 0.17,
        "k": 0.153,
        "bt": -0.0001667,
        "d": 0.055,
        "cash": 6,
        "demonym": "Mexican",
        "ks": "M",
        "kc": 77,
        "leader": "president"
    },
    can: {
        "country": "Canada",
        "id": "CAN",
        "pop": 37593380,
        "cc": 93288,
        "pcc": 0.002481500732309784,
        "cd": 7952,
        "nc": 809,
        "nd": 46,
        "b": 0.19,
        "k": 0.2,
        "bt": 0.00005,
        "d": 0.015,
        "cash": 8,
        "demonym": "Canadian",
        "ks": "C",
        "kc": 67,
        "leader": "prime minister"
    },
    sau: {
        "country": "Saudi Arabia",
        "id": "SAU",
        "pop": 34268530,
        "cc": 87142,
        "pcc": 0.0025429161974557996,
        "cd": 525,
        "nc": 1881,
        "nd": 22,
        "b": 0.1633,
        "k": 0.1667,
        "bt": -0.00333,
        "d": 0.0245,
        "cash": 6,
        "demonym": "Saudi",
        "ks": "D",
        "kc": 68,
        "leader": "king"
    },
    chn: {
        "country": "China",
        "id": "CHN",
        "pop": 1397715000,
        "cc": 84154,
        "pcc": 0.000060208268495365654,
        "cd": 4638,
        "nc": 8,
        "nd": 0,
        "b": 0.17,
        "k": 0.17,
        "bt": 0.00005,
        "d": 0.0238,
        "cash": 8,
        "demonym": "Chinese",
        "ks": "Z",
        "kc": 90,
        "leader": "president"
    },
    pak: {
        "country": "Pakistan",
        "id": "PAK",
        "pop": 216565320,
        "cc": 76398,
        "pcc": 0.0003527711639148872,
        "cd": 1621,
        "nc": 3938,
        "nd": 78,
        "b": 0.1325,
        "k": 0.1458,
        "bt": -0.000067,
        "d": 0.0329,
        "cash": 6,
        "demonym": "Pakistani",
        "ks": "P",
        "kc": 80,
        "leader": "prime minister"
    }
}
const RELATIONS = JSON.parse("[[\"usa\",\"bra\",3.5],[\"usa\",\"rus\",1.5],[\"usa\",\"gbr\",4],[\"usa\",\"esp\",3.8],[\"usa\",\"ita\",3.8],[\"usa\",\"ind\",3.5],[\"usa\",\"fra\",4],[\"usa\",\"deu\",4],[\"usa\",\"per\",3.5],[\"usa\",\"tur\",2.3],[\"usa\",\"irn\",1],[\"usa\",\"chl\",3.5],[\"usa\",\"mex\",3.2],[\"usa\",\"can\",4],[\"usa\",\"sau\",2.9],[\"usa\",\"chn\",1.5],[\"usa\",\"pak\",2.8],[\"bra\",\"rus\",3.4],[\"bra\",\"gbr\",3.5],[\"bra\",\"esp\",3.5],[\"bra\",\"ita\",3.5],[\"bra\",\"ind\",3.8],[\"bra\",\"fra\",3.5],[\"bra\",\"deu\",3.5],[\"bra\",\"per\",3.8],[\"bra\",\"tur\",3.5],[\"bra\",\"irn\",3],[\"bra\",\"chl\",3.8],[\"bra\",\"mex\",3.8],[\"bra\",\"can\",3.5],[\"bra\",\"sau\",3.5],[\"bra\",\"chn\",3.5],[\"bra\",\"pak\",3.5],[\"rus\",\"gbr\",2.8],[\"rus\",\"esp\",3.2],[\"rus\",\"ita\",3.4],[\"rus\",\"ind\",3.8],[\"rus\",\"fra\",3.4],[\"rus\",\"deu\",2.8],[\"rus\",\"per\",3.4],[\"rus\",\"tur\",2.8],[\"rus\",\"irn\",3.8],[\"rus\",\"chl\",3.4],[\"rus\",\"mex\",3.5],[\"rus\",\"can\",3.2],[\"rus\",\"sau\",3.6],[\"rus\",\"chn\",3.7],[\"rus\",\"pak\",3.3],[\"gbr\",\"esp\",3.5],[\"gbr\",\"ita\",3.6],[\"gbr\",\"ind\",3.6],[\"gbr\",\"fra\",3.8],[\"gbr\",\"deu\",3.6],[\"gbr\",\"per\",3.5],[\"gbr\",\"tur\",3.6],[\"gbr\",\"irn\",2.8],[\"gbr\",\"chl\",3.5],[\"gbr\",\"mex\",3.5],[\"gbr\",\"can\",4],[\"gbr\",\"sau\",3.4],[\"gbr\",\"chn\",2],[\"gbr\",\"pak\",3.5],[\"esp\",\"ita\",3.8],[\"esp\",\"ind\",3.5],[\"esp\",\"fra\",3.8],[\"esp\",\"deu\",3.8],[\"esp\",\"per\",3.5],[\"esp\",\"tur\",3.6],[\"esp\",\"irn\",3],[\"esp\",\"chl\",3.5],[\"esp\",\"mex\",3.4],[\"esp\",\"can\",3.8],[\"esp\",\"sau\",3.5],[\"esp\",\"chn\",3],[\"esp\",\"pak\",3.5],[\"ita\",\"ind\",3.5],[\"ita\",\"fra\",4],[\"ita\",\"deu\",4],[\"ita\",\"per\",3.6],[\"ita\",\"tur\",3.5],[\"ita\",\"irn\",3.4],[\"ita\",\"chl\",3.5],[\"ita\",\"mex\",3.5],[\"ita\",\"can\",3.8],[\"ita\",\"sau\",3.5],[\"ita\",\"chn\",3.4],[\"ita\",\"pak\",3.5],[\"ind\",\"fra\",3.8],[\"ind\",\"deu\",3.5],[\"ind\",\"per\",3.5],[\"ind\",\"tur\",2.8],[\"ind\",\"irn\",3.3],[\"ind\",\"chl\",3.5],[\"ind\",\"mex\",3.8],[\"ind\",\"can\",3.5],[\"ind\",\"sau\",3.6],[\"ind\",\"chn\",2.5],[\"ind\",\"pak\",1],[\"fra\",\"deu\",4],[\"fra\",\"per\",3.5],[\"fra\",\"tur\",3.2],[\"fra\",\"irn\",2.8],[\"fra\",\"chl\",3.5],[\"fra\",\"mex\",3.5],[\"fra\",\"can\",4],[\"fra\",\"sau\",3.7],[\"fra\",\"chn\",3],[\"fra\",\"pak\",3.2],[\"deu\",\"per\",3.5],[\"deu\",\"tur\",3.2],[\"deu\",\"irn\",2.7],[\"deu\",\"chl\",3.5],[\"deu\",\"mex\",3.5],[\"deu\",\"can\",3.5],[\"deu\",\"sau\",3.3],[\"deu\",\"chn\",3.5],[\"deu\",\"pak\",3.4],[\"per\",\"tur\",3.5],[\"per\",\"irn\",3.3],[\"per\",\"chl\",3.4],[\"per\",\"mex\",3.8],[\"per\",\"can\",3.5],[\"per\",\"sau\",3.5],[\"per\",\"chn\",3.5],[\"per\",\"pak\",3.5],[\"tur\",\"irn\",3.3],[\"tur\",\"chl\",3.5],[\"tur\",\"mex\",3.6],[\"tur\",\"can\",3.3],[\"tur\",\"sau\",2.7],[\"tur\",\"chn\",3.5],[\"tur\",\"pak\",3.7],[\"irn\",\"chl\",3.3],[\"irn\",\"mex\",3.4],[\"irn\",\"can\",2],[\"irn\",\"sau\",1],[\"irn\",\"chn\",3.6],[\"irn\",\"pak\",3.4],[\"chl\",\"mex\",4],[\"chl\",\"can\",3.8],[\"chl\",\"sau\",3.5],[\"chl\",\"chn\",3.5],[\"chl\",\"pak\",3.3],[\"mex\",\"can\",3.5],[\"mex\",\"sau\",3.5],[\"mex\",\"chn\",3.8],[\"mex\",\"pak\",3.6],[\"can\",\"sau\",3.2],[\"can\",\"chn\",2.8],[\"can\",\"pak\",3.6],[\"sau\",\"chn\",3.8],[\"sau\",\"pak\",3.8],[\"chn\",\"pak\",3.7]]");
const CODON = [
	{
		l: "Phe",
		n: ["UUU", "UUC"],
		s: "F"
	},
	{
		l: "Leu",
		n: ["UUA", "UUG", "CU*"],
		s: "L"
	},
	{
		l: "Ser",
		n: ["UC*", "AGU", "AGC"],
		s: "S"
	},
	{
		l: "Tyr",
		n: ["UAU", "UAC"],
		s: "Y"
	},
	{
		l: "Cys",
		n: ["UGU", "UGC"],
		s: "C"
	},
	{
		l: "Trp",
		n: ["UGG"],
		s: "W"
	},
	{
		l: "Pro",
		n: ["CC*"],
		s: "P"
	},
	{
		l: "His",
		n: ["CAU", "CAC"],
		s: "H"
	},
	{
		l: "Gln",
		n: ["CAA", "CAG"],
		s: "Q"
	},
	{
		l: "Arg",
		n: ["CG*", "AGA", "AGG"],
		s: "R"
	},
	{
		l: "Ile",
		n: ["AUU", "AUC", "AUA"],
		s: "I"
	},
	{
		l: "Met",
		n: ["AUG"],
		s: "M"
	},
	{
		l: "Thr",
		n: ["AC*"],
		s: "T"
	},
	{
		l: "Asn",
		n: ["AAU", "AAC"],
		s: "N"
	},
	{
		l: "Lys",
		n: ["AAA", "AAG"],
		s: "K"
	},
	{
		l: "Val",
		n: ["GU*"],
		s: "V"
	},
	{
		l: "Ala",
		n: ["GC*"],
		s: "A"
	},
	{
		l: "Asp",
		n: ["GAU", "GAC"],
		s: "D"
	},
	{
		l: "Glu",
		n: ["GAA", "GAG"],
		s: "E"
	},
	{
		l: "Gly",
		n: ["GG*"],
		s: "G"
	},
	{
		l: "TER",
		n: ["UAA", "UAG", "UGA"],
		s: "*"
	}
];
var additions = [[["2-PE"], ["Thiomersal"], ["Carbolic acid"], ["Methylparaben"]], [["Sucrose"], ["Gelatin"], ["Albumin"], ["Dextrose"]], [["Polysorbate 80"], ["Triton X-100"], ["Synperonic"], ["DODAB"]], [["Sterile water"], ["0.4% NaCl"], ["0.9% NaCl"], ["PBS"]], [["Aluminum phosphate"], ["Aluminum hydroxide"], ["Interleukin-2"], ["Squalene"]]];
var candidates = {};

var seq_c = sessionStorage.getItem("seq_c");
var seq_p = sessionStorage.getItem("seq_p");
var per_c = 0;
var per_p = 0;

var facilities = JSON.parse(sessionStorage.getItem("facilities"));
var relations = {};
var loans = 0;

var deliveries = {};

var rc = 0;
var rf = 0;
function updateMoney() {
	if (money <= 0) {
		money = 0;
	}
	if (money < 20000 || per_p == 1) {
		$("#runTest").attr("disabled", "true");
	} else {
		$("#runTest").removeAttr("disabled");
	}
	if (money < 1000000 && cleared.length == 3) {
		$("#d3 .card-footer button").attr("disabled", "true");
	} else {
		for (var i = 0; i < upgrades[0].length; i++) {
			canResearch(0, i);
			canResearch(1, i);
		}
	}
	$("#cash").html((dmoney == 0 ? "" : "(" + (dmoney > 0 ? "+$" + toShort(dmoney, 2) : "-$" + (toShort(dmoney * -1, 2))) + ") ") + "$" + toShort(money, 3));
}

function selectProtein(n) {
	$("#cp" + n).focus();
}
function selectCodon(n) {
	$("#cc" + n).addClass("active");
}
function deselectCodon(n) {
	$("#cc" + n).removeClass("active");
}
function changed(n) {
	$("#cc" + n).addClass("changed");
	$("#cp" + n).addClass("changed");
	$("#cc" + n).removeClass("bonus");
	$("#cp" + n).removeClass("bonus");
}

var doses = 0;
var dp = 0;
function updateDoses() {
	var deductm = 0;
	var addm = 0;
	for (var i = 0; i < facilities.length; i++) {
		deductm += (data[facilities[i][0]].cash * 10000 * (10 * facilities[i][1]) / 365);
	}
	var deduct = 0;
	var add = 0;
	var total = 0;
	var distribution = {};
	for (var j in deliveries) {
		total += deliveries[j];
	}
	for (var g in deliveries) {
		if (data[g].st * data[g].pop < deliveries[g]) {
			deliveries[g] = data[g].st * data[g].pop;
		}
		distribution[g] = deliveries[g] / total;
	}
	for (var k = 0; k < facilities.length; k++) {
		add += facilities[k][2];
		deductm += 15 * facilities[k][2];
	}
	if (doses + add >= total) {
		for (var l in distribution) {
			addm += 20 * deliveries[l];
		}
	} else {
		for (var l in distribution) {
			addm += (20 * (distribution[l] * (doses + add)));
		}
	}
	if (money + addm >= deductm) {
		doses += add;
		dp += add;
		money += addm;
		money -= deductm;
	} else {
		add = 0;
	}
	if (doses >= total) {
		for (var l in distribution) {
			data[l].doses += deliveries[l];
		}
		deduct = total;
	} else {
		for (var l in distribution) {
			data[l].doses += (distribution[l] * (doses + add));
		}
		deduct = (doses + add);
	}
	dmoney = (addm - deductm);
	updateMoney();
	doses -= deduct;
	var ddose = add - deduct;
	$("#dose").html((ddose == 0 ? "" : "(" + (ddose > 0 ? "+" + toShort(ddose, 2) : "-" + (toShort(ddose * -1, 2))) + ") ") + "" + toShort(doses, 3));
}

function upgradeFacility(country) {
	for (var i = 0; i < facilities.length; i++) {
		if (facilities[i][0] == country) {
			money -= (((data[country].cash / 5) + (2.25 ** (4 - relations[country] + facilities[i][1])) - 1) * 100000 * 2);
			dmoney = -1 * (((data[country].cash / 5) + (2.25 ** (4 - relations[country] + facilities[i][1])) - 1) * 100000 * 2);
			rc += (((data[country].cash / 5) + (2.25 ** (4 - relations[country] + facilities[i][1])) - 1) * 100000 * 2);
			updateMoney();
			$("#" + country).removeClass("facility-" + facilities[i][1]);
			facilities[i][1]++;
			$("#" + country).addClass("facility-" + facilities[i][1]);
			if (relations[country] + 0.4 <= 7) {
				relations[country] += 0.4;
			}
			if (cleared.length == 3) {
				$("#d3 select option[value=" + country + "]").html(data[country].country + " (Level " + facilities[i][1] + ")</option>");
			} else if (cleared.length == 1) {
				var count = 0;
				for (var j = 0; j < facilities.length; j++) {
					count += facilities[j][1];
				}
				if (count <= 8) {
					count--;
					$("#candidates").append("<tr id = 'candidate" + alpha.charAt(count) + "'><td>Candidate " + alpha.charAt(count) + "</td><td><select class = 'custom-select custom-select-sm' id = '" + alpha.charAt(count) + "0'><option selected disabled value = 'null'>Select...</option></select></td><td><select class = 'custom-select custom-select-sm'id = '" + alpha.charAt(count) + "1'><option selected disabled value = 'null'>Select...</option></select></td><td><select class = 'custom-select custom-select-sm'id = '" + alpha.charAt(count) + "2'><option selected disabled value = 'null'>Select...</option></select></td><td><select class = 'custom-select custom-select-sm'id = '" + alpha.charAt(count) + "3'><option selected disabled value = 'null'>Select...</option></select></td><td><select class = 'custom-select custom-select-sm' id = '" + alpha.charAt(count) + "4'><option selected disabled value = 'null'>Select...</option></select></td><td>?</td>");
					for (var k = 0; k < additions.length; k++) {
						for (var l = 0; l < additions[k].length; l++) {
							$("#" + alpha.charAt(count) + k).append("<option value = '" + l + "'>" + additions[k][l][0] + "</option>");
							candidates[alpha.charAt(count)] = [-1, -1, -1, -1, -1];
						}
					}
				}
			}
			$("#country").modal("hide");
			$("#console").append("<p><b class = 'text-success'>" + toDate(currentDate) + " " + name + " upgrades their facility in " + (country == "usa" || country == "gbr" ? "the " : "") + data[country].country + "</b></p>");
			$("#console").scrollTop($("#console").prop("scrollHeight"));
			break;
		}
	}
}
function establishFacility(country) {
	facilities[facilities.length] = [country, 1];
	if (cleared.length == 4) {
		facilities[facilities.length - 1][2] = 0;
	}
	money -= ((data[country].cash / 5) + (2.25 ** (4 - relations[country])) - 1) * 100000;
	dmoney = -1 * ((data[country].cash / 5) + (2.25 ** (4 - relations[country])) - 1) * 100000;
	rc += ((data[country].cash / 5) + (2.25 ** (4 - relations[country])) - 1) * 100000;
	updateMoney();
	$("#" + country).addClass("facility-1");
	if (relations[country] + toPlaces((2 / (facilities.length - 1)), 1) <= 10) {
		relations[country] += toPlaces((2 / (facilities.length - 1)), 1);
	} else {
		relations[country] = 10;
	}
	$("#" + country + "_r").html("WTC " + toPlaces(relations[country], 1) + " / 10");
	for (var j = 0; j < RELATIONS.length; j++) {
		if (RELATIONS[j].indexOf(country) != -1) {
			var current = relations[RELATIONS[j][(1 - RELATIONS[j].indexOf(country))]];
			var change = toPlaces(((1 / ((facilities.length - 1) + 0.5)) * (RELATIONS[j][2] - 3)), 1);
			if (!((current + change > 7 && change > 0) || (current + change < 1 && change < 0))) {
				relations[RELATIONS[j][(1 - RELATIONS[j].indexOf(country))]] += toPlaces(((1 / ((facilities.length - 1) + 0.5)) * (RELATIONS[j][2] - 3)), 1);
			}
			$("#" + RELATIONS[j][(1 - RELATIONS[j].indexOf(country))] + "_r").html("WTC " + toPlaces(relations[RELATIONS[j][(1 - RELATIONS[j].indexOf(country))]], 1) + " / 10");
		}
	}
	if (cleared.length == 3) {
		$("#d3 select").append("<option value = '" + country + "'>" + data[country].country + " (Level 1)</option>");
	} else if (cleared.length == 1) {
		var count = 0;
		for (var i = 0; i < facilities.length; i++) {
			count += facilities[i][1];
		}
		if (count <= 8) {
			count--;
			$("#candidates").append("<tr id = 'candidate" + alpha.charAt(count) + "'><td>Candidate " + alpha.charAt(count) + "</td><td><select class = 'custom-select custom-select-sm' id = '" + alpha.charAt(count) + "0'><option selected disabled value = 'null'>Select...</option></select></td><td><select class = 'custom-select custom-select-sm'id = '" + alpha.charAt(count) + "1'><option selected disabled value = 'null'>Select...</option></select></td><td><select class = 'custom-select custom-select-sm'id = '" + alpha.charAt(count) + "2'><option selected disabled value = 'null'>Select...</option></select></td><td><select class = 'custom-select custom-select-sm'id = '" + alpha.charAt(count) + "3'><option selected disabled value = 'null'>Select...</option></select></td><td><select class = 'custom-select custom-select-sm' id = '" + alpha.charAt(count) + "4'><option selected disabled value = 'null'>Select...</option></select></td><td>?</td>");
			for (var k = 0; k < additions.length; k++) {
				for (var l = 0; l < additions[k].length; l++) {
					$("#" + alpha.charAt(count) + k).append("<option value = '" + l + "'>" + additions[k][l][0] + "</option>");
					candidates[alpha.charAt(count)] = [-1, -1, -1, -1, -1];
				}
			}
		}
	}
	$("#country").modal("hide");
	$("#console").append("<p><b class = 'text-success'>" + toDate(currentDate) + " " + name + " establishes a new facility in " + (country == "usa" || country == "gbr" ? "the " : "") + data[country].country + "</b></p>");
	$("#console").scrollTop($("#console").prop("scrollHeight"));
}

var cf3 = 0;
var aer = 0;
var initial3 = 0;
var em = 0;
var sm = 0;
var smp = 0;
var research = {};
var trials_3 = {};
var upgrades = [[["Enhanced delivery system", "Lipid nanoparticles added to improve vaccine targeting and delivery"], ["Spike formation", "Certain amino acids modified to induce active structure configuration on protein coat"], ["Signal peptide creation", "Specific cellular organelles targeted using glycoproteins signal peptides"], ["Untranslated region enhancement", "3'-UTR segment modified to increase stability, expression, and efficiency"], ["Poly-A tail elongation", "Polyadenylated tail length increased to extend time until degradation"], ["Nucleotide linker introduction", "10-nucleotide linker added to RNA sequence to increase transcription efficiency"]], [["Adjuvant concentration modification", "Adjuvant concentration decreased to lower severity of immune response"], ["Synonymous modifications", "Codon third bases substituted to decrease likelihood of immune over-response"], ["Uracil substitution", "RNA uracil bases replaced with synthetic version to decrease likelihood of immune over-response"], ["Acidity regulator", "Tromethamine hydrochloride added to balance pH and preserve vaccine"], ["Preservative concentration modification", "Preservative concentration increased to prevent contamination"], ["Antibiotic concentration modification", "Antibiotic concentration decreased to lower likelihood of allergic response"]]];
function completeResearch() {
	$("#d3 select, #d3 button").attr("disabled", "true");
	$("#d3 > p").remove();
	$("#eff").html("<b>Effectiveness: " + toPlaces(eff * 100, 2) + "%</b>");
	for (var i in trials_3) {
		delete trials_3[i];
	}
	for (var j = 0; j < facilities.length; j++) {
		facilities[j][2] = 0;
	}
	cleared[3] = new Date(currentDate.getTime());
	$("#phase").html("Completed");
	$("#console").append("<p><b class = 'text-success'>" + toDate(currentDate) + " " + name + " finalizes vaccine and prepares to begin manufacturing and distribution</b></p>");
	$("#console").append("<p><b class = 'text-success'>PHASE III CLEARED IN: " + (Math.round(Math.abs((cleared[2] - currentDate) / (24 * 60 * 60 * 1000)))) + " days</b></p>");
	$("#console").scrollTop($("#console").prop("scrollHeight"));
	$("#research").modal("hide");
}
function checkLicensure() {
	for (var i in data) {
		if (!data[i].approved && relations[i] >= 8 && (1 - 0.15 * ((relations[i] - 7.5) / 2)) <= eff && (0.1 ** (10 - relations[i]) >= aer)) {
			data[i].approved = true;
			var cname = (i == "usa" || i == "gbr" ? "the " : "") + data[i].country;
			$("#console").append("<p><b class = 'text-success'>" + toDate(currentDate) + " " + name + " obtains license to vaccinate in " + cname + "</b></p>");
			$("#" + i + "_v").html("(+0) 0");
			if (cleared.length == 3) {
				$("#d3 > p").html("<button class = 'btn btn-primary btn-sm' onclick = 'javascript:completeResearch()'>Finalize Vaccine and Begin Manufacturing & Distribution</button>");
			}
		}
	}
}
function concludeResearch(t) {
	var upgrade = research[t];
	$("#upgrade" + upgrade.x + upgrade.y + " span").addClass("text-success");
	$("#upgrade" + upgrade.x + upgrade.y + " span").html("Completed");
	$("#d3 :not(#upgrade" + upgrade.x + upgrade.y + ") option[value=" + t + "]").removeAttr("disabled");
	if (upgrade.x == 0) {
		em += toPlaces(Math.random() * (0.03 - 0.02) + 0.02, 4);
	} else {
		sm++;
	}
	delete research[t];
}
function canResearch(x, y) {
	if ($("#upgrade" + x + y + " select").val() == null || money < 1000000) {
		$("#upgrade" + x + y + " button").attr("disabled", "true");
	} else {
		$("#upgrade" + x + y + " button").removeAttr("disabled");
	}
}
function researchUpgrade(x, y) {
	var t = $("#upgrade" + x + y + " select").val()
	var lvl = 0;
	for (var i = 0; i < facilities.length; i++) {
		if (facilities[i][0] == t) {
			lvl = facilities[i][1];
			break;
		}
	}
	research[t] = { "x": x, "y": y, "time": 14 - (4 * (lvl - 1)) };
	$("#upgrade" + x + y + " select").attr("disabled", "true");
	$("#upgrade" + x + y + " button").replaceWith("<span class = 'ml-3'>" + (14 - (4 * (lvl - 1))) + " days left</span>");
	for (var j = 0; j < upgrades[0].length; j++) {
		if ($("#upgrade0" + j + " select:not(:disabled)").val() == t && !(x == 0 && j == y)) {
			$("#upgrade0" + j + " select:not(:disabled)").val("null");
		}
		if ($("#upgrade1" + j + " select:not(:disabled)").val() == t && !(x == 1 && j != y)) {
			$("#upgrade1" + j + " select:not(:disabled)").val("null");
		}
	}
	$("#d3 select:not(:disabled) option[value=" + t + "]").attr("disabled", "true");
	money -= 1000000;
	dmoney = -1000000;
	rc += 1000000;
	updateMoney();
	if (money < 1000000) {
		$("#d3 .card-footer button").attr("disabled", "true");
	}
}
function resultsThree(t) {
	var trial = trials_3[t];
	var modify = trial.em;
	if (initial3 + modify > 1) { modify = 1 - initial3; }
	if (initial3 + modify > eff) {
		for (var j in relations) {
			if (relations[j] + (12 * ((initial3 + modify) - eff)) < 10) {
				relations[j] += (12 * ((initial3 + modify) - eff));
			} else {
				relations[j] = 10;
			}
			$("#" + j + "_r").html("WTC " + toPlaces(relations[j], 1) + " / 10");
		}
	}
	if (trial.sm > smp) {
		for (var j in relations) {
			if (relations[j] + (0.3 * (trial.sm - smp)) < 10) {
				relations[j] += (0.3 * (trial.sm - smp));
			} else {
				relations[j] = 10;
			}
			$("#" + j + "_r").html("WTC " + toPlaces(relations[j], 1) + " / 10");
		}
	}
	$("#eff").html("Effectiveness: " + toPlaces((initial3 + modify) * 100, 2) + "%");
	$("#p3 td:first-child").html("Upgrade Effectiveness (current: " + toPlaces((initial3 + modify) * 100, 2) + "%)");
	var funding = (data[t].cash * 25000000) * (2 ** (1 + modify)) * (modify - (eff - initial3)) * (1 - modify) * ((1.5 * (10 + data[t].cash) * modify) / 8);
	var safety = toPlaces(100 - toPlaces((aer * (0.5 ** trial.sm)) * 100, 2), 2);
	$("#p3 td:last-child").html("Upgrade Safety (current: " + safety + "%)");
	var toAppend = "";
	if (initial3 + modify > eff || trial.sm > smp) {
		toAppend = "<p><b class = 'text-success'>" + toDate(currentDate) + " " + name + " concludes phase III trials with " + toPlaces((initial3 + modify) * 100, 2) + "% effectiveness (+" + toPlaces((initial3 + modify - eff) * 100, 2) + "%) and " + safety + "% safety (+" + toPlaces(safety - (100 - toPlaces(aer * 100, 2)), 2) + "%), and receives $" + toShort(funding, 2) + " in funds</b></p>";
	} else {
		toAppend = "<p><b class = 'text-danger'>" + toDate(currentDate) + " " + name + " concludes phase III trials with " + toPlaces((initial3 + modify) * 100, 2) + "% effectiveness (" + toPlaces((initial3 + modify - eff) * 100, 2) + "%) and " + safety + "% safety (" + toPlaces(safety - (100 - toPlaces(aer * 100, 2)), 2, true) + "%)</b></p>"
	}
	eff = initial3 + modify;
	aer *= (0.5 ** trial.sm);
	smp = trial.sm;
	money += funding;
	dmoney = funding;
	rf += funding;
	updateMoney();
	checkLicensure();
	$("#console").append(toAppend);
	$("#console").scrollTop($("#console").prop("scrollHeight"));
	delete trials_3[t];
}
function trialThree(country, lvl) {
	trials_3[country] = { "time": 7 * (5 - lvl), "em": em, "sm": sm }
	money -= 3000000;
	dmoney = -3000000;
	rc += 3000000;
	updateMoney();
	$("#console").append("<p><b class = 'text-success'>" + toDate(currentDate) + " " + name + " begins Phase III trials at its " + data[country].demonym + " facility</b></p>");
	$("#console").scrollTop($("#console").prop("scrollHeight"));
	$("#country").modal("hide");
}
function phaseThree(d, e, a, n, dd) {
	cf3 = d;
	eff = e;
	aer = a;
	initial3 = eff;
	$("#p3 td:first-child").html("Upgrade Effectiveness (current: " + toPlaces(eff * 100, 2) + "%)");
	$("#p3 td:last-child").html("Upgrade Safety (current: " + (100 - toPlaces(aer * 100, 2)) + "%)");
	$("#dosage" + n + " td:last-child button").html("Advanced");
	$("#d2 button").attr("disabled", "true");
	$("#eff").html("Effectiveness: " + toPlaces(eff * 100, 2) + "%");
	for (var i in trials_2) {
		$("#dosage" + trials_2[i].num + " td:first-child").html("Cancelled");
		delete trials_2[i];
	}
	cleared[2] = new Date(currentDate.getTime());
	$("#phase").html("Phase: III");
	$("#t3").removeClass("disabled");
	$("#t3").html("Phase III");
	for (var i = 0; i < upgrades[0].length; i++) {
		$("#d3 #upgrades").append("<tr><td><div class = 'card-deck my-2'><div class = 'card' id = 'upgrade0" + i + "'><div class = 'card-body'><h6 class = 'card-title mb-2'>" + upgrades[0][i][0] + "</h6><p class = 'card-text'>" + upgrades[0][i][1] + "</p></div><div class = 'card-footer'><p class = 'mb-0'><select class = 'custom-select custom-select-sm' onchange = 'canResearch(0, " + i + ")'><option value = 'null' selected disabled>Facility...</option></select><button disabled class = 'btn btn-primary btn-sm ml-3' onclick = 'javascript:researchUpgrade(0, " + i + ")'>Research - $1M</button></p></div></div></div></td></tr>");
		$("#d3 #upgrades tr:last-child .card-deck").append("<div class = 'card' id = 'upgrade1" + i + "'><div class = 'card-body'><h6 class = 'card-title mb-2'>" + upgrades[1][i][0] + "</h6><p class = 'card-text'>" + upgrades[1][i][1] + "</p></div><div class = 'card-footer'><p class = 'mb-0'><select class = 'custom-select custom-select-sm' onchange = 'canResearch(1, " + i + ")'><option value = 'null' selected disabled>Facility...</option></select><button disabled class = 'btn btn-primary btn-sm ml-3' onclick = 'javascript:researchUpgrade(1, " + i + ")'>Research - $1M</button></p></div></div>");
	}
	for (var j = 0; j < facilities.length; j++) {
		$("#d3 select").append("<option value = '" + facilities[j][0] + "'>" + data[facilities[j][0]].country + " (Level " + facilities[j][1] + ")</option>");
	}
	$("#t3").tab("show");
	$("#console").append("<p><b class = 'text-success'>" + toDate(currentDate) + " " + name + " advances " + dd + " dosage to Phase III clinical trials. \"This pandemic will soon be a thing of the past,\" says " + name + " CEO</b></p>");
	$("#console").append("<p><b class = 'text-success'>PHASE II CLEARED IN: " + (Math.round(Math.abs((cleared[1] - currentDate) / (24 * 60 * 60 * 1000)))) + " days</b></p>");
	$("#console").scrollTop($("#console").prop("scrollHeight"));
	$("#research").modal("hide");
}

var cf2 = "";
var initial2 = 0;
var d = toPlaces(Math.random() * (100 - 25 + 1) + 25, 0);
var z = Math.random() * 10 - 5;
var count2 = 0;
var trials_2 = {};
function resultsTwo(t) {
	var trial = trials_2[t];
	var modify = 0.008 * (15 - (0.5 * Math.abs(trial.dosage - d)));
	var adverse = toPlaces(0.01 * (2.5 ** (0.1 * (trial.dosage - (d + z)))), 4);
	if (adverse > 1) { adverse = 1 }; 
	$("#dosage" + trial.num).html("<td><img src = 'flags/" + t + ".png' style = 'height: 1em; position: relative; top: -1px; border: 0.5px solid rgba(0, 0, 0, 0.3)'></td><td>" + trial.dd + "</td><td>" + (100 - toPlaces(adverse * 100, 2)) + "%</td><td>" + toPlaces((initial2 + modify) * 100, 2) + "%</td><td> - </td>");
	for (var j in relations) {
		if (relations[j] + (5 * ((initial2 + modify) - eff)) < 9.2 && (initial2 + modify) - eff > 0) {
			relations[j] += (5 * ((initial2 + modify) - eff));
		} else if ((initial2 + modify) - eff > 0) {
			relations[j] = 9.2;
		}
		$("#" + j + "_r").html("WTC " + toPlaces(relations[j], 1) + " / 10");
	}
	if (initial2 + modify > eff) {
		cf3 = trial.dosage;
		var funding = (data[t].cash * 25000000) * (2 ** (1 + modify)) * (modify - (eff - initial2)) * (1 - modify) * ((1.5 * (10 + data[t].cash) * modify) / 8);
		$("#eff").html("Effectiveness: " + toPlaces((initial2 + modify) * 100, 2) + "%");
		$("#console").append("<p><b class = 'text-success'>" + toDate(currentDate) + " " + name + " concludes phase II trials of " + trial.dd + " dosage with " + toPlaces((initial2 + modify) * 100, 2) + "% effectiveness (+" + toPlaces((initial2 + modify - eff) * 100, 2) + "%) and receives $" + toShort(funding, 2) + " in funds</b></p>");
		$(".leading").removeClass("leading");
		$("#dosage" + trial.num).addClass("leading");
		eff = initial2 + modify;
		money += funding;
		dmoney = funding;
		rf += funding;
		updateMoney();
		if (eff >= 0.8) {
			$("#dosage" + trial.num + " td:last-child").html("<button class = 'btn btn-primary btn-sm' onclick = 'javascript:phaseThree(\"" + trial.dosage + "\", " + eff + ", " + adverse + ", " + trial.num + ", \"" + trial.dd + "\")' style = 'position: relative; top: -5px'>Advance to Phase III</button>");
		}
	} else {
		$("#console").append("<p><b class = 'text-danger'>" + toDate(currentDate) + " " + name + " concludes phase II trials of " + trial.dd + " dosage with " + toPlaces((initial2 + modify) * 100, 2) + "% effectiveness (-" + toPlaces((-100 * (initial2 + modify - eff)), 2) + "%)</b></p>");
		if (initial2 + modify >= 0.8) {
			$("#dosage" + trial.num + " td:last-child").html("<button class = 'btn btn-primary btn-sm' onclick = 'javascript:phaseThree(\"" + trial.dosage + "\", " + eff + ", " + adverse + ", " + trial.num + ", \"" + trial.dd + "\")' style = 'position: relative; top: -5px'>Advance to Phase III</button>");
		}
	}
	$("#console").scrollTop($("#console").prop("scrollHeight"));
	delete trials_2[t];
}
function trialTwo(country, lvl, event) {
	var dosage = Number($("#di").val()) * 100;
	if (typeof event == "undefined" || (typeof event != "undefined" && event.keyCode == 13 && !isNaN(dosage) && dosage >= 25 && dosage <= 100 && toPlaces(dosage, 1) == dosage && money >= 1000000)) {
		$("#dosages").append("<tr id = 'dosage" + count2 + "'><td><img src = 'flags/" + country + ".png' style = 'height: 1em; position: relative; top: -1px; border: 0.5px solid rgba(0, 0, 0, 0.3)' class = 'mr-2'> " + (7 * (5 - lvl)) + " days left</td><td>" + toPlaces($("#ds").val() / 100, 2) + ($("#ds").val() == 100 ? ".0" : "") + "mL</td><td>?</td><td>?</td><td> - </td>");
		trials_2[country] = { "time": 7 * (5 - lvl), "dosage": dosage, "num": count2, "dd": (toPlaces($("#ds").val() / 100, 2) + ($("#ds").val() == 100 ? ".0" : "") + "mL") }
		money -= 1000000;
		dmoney = -1000000;
		rc += 1000000;
		updateMoney();
		if (count2 == 0) {
			$("#d2 p:last-child").remove();
		}
		count2++;
		$("#console").append("<p><b class = 'text-success'>" + toDate(currentDate) + " " + name + " begins Phase II trials of " + trials_2[country].dd + " dosage at its " + data[country].demonym + " facility</b></p>");
		$("#console").scrollTop($("#console").prop("scrollHeight"));
		$("#country").modal("hide");
	}
}
function phaseTwo(c, e) {
	cf2 = c;
	eff = e;
	initial2 = eff;
	$("#eff").html("Effectiveness: " + toPlaces(eff * 100, 2) + "%");
	$("#d1 select").attr("disabled", "true");
	$("#d1 p").remove();
	for (var i in trials_1) {
		$("#candidate" + trials_1[i].candidate + " td:last-child").html("Cancelled");
		delete trials_1[i];
	}
	cleared[1] = new Date(currentDate.getTime());
	$("#phase").html("Phase: II");
	$("#t2").removeClass("disabled");
	$("#t2").html("Phase II");
	$("#t2").tab("show");
	$("#console").append("<p><b class = 'text-success'>" + toDate(currentDate) + " " + name + " advances Candidate " + c + " vaccine to Phase II clinical trials. Doctors everywhere look forward to upcoming trial results</b></p>");
	$("#console").append("<p><b class = 'text-success'>PHASE I CLEARED IN: " + (Math.round(Math.abs((cleared[0] - currentDate) / (24 * 60 * 60 * 1000)))) + " days</b></p>");
	$("#console").scrollTop($("#console").prop("scrollHeight"));
	$("#research").modal("hide");
}

var trials_1 = {};
var descriptors = { "0.04": "Very effective", "0.02": "Somewhat effective", "0": "Ineffective", "-0.02": "Detrimental" };
function resultsOne(t) {
	var trial = trials_1[t].candidate;
	var modifier = [];
	var modify = 0;
	var results = "";
	for (var i = 0; i < candidates[trial].length; i++) {
		modifier[i] = additions[i][candidates[trial][i]][1];
		modify += modifier[i];
		results += ("<br>" + additions[i][candidates[trial][i]][0] + ": " + descriptors[(additions[i][candidates[trial][i]][1] + "")]);
	}
	$("#candidate" + trial + " select").removeAttr("disabled");
	$("#candidate" + trial + " td:last-child").html(toPlaces((initial + modify) * 100, 2) + "%");
	for (var j in relations) {
		if (relations[j] + (5 * ((initial + modify) - eff)) < 8.2 && (initial + modify) - eff > 0) {
			relations[j] += (5 * ((initial + modify) - eff));
		} else if ((initial + modify) - eff > 0) {
			relations[j] = 8.2;
		}
		$("#" + j + "_r").html("WTC " + toPlaces(relations[j], 1) + " / 10");
	}
	if (initial + modify > eff) {
		cf2 = trial;
		var funding = (data[t].cash * 3000000) * (2 ** (1 + modify)) * (modify - (eff - initial)) * (1 - modify) * ((1.5 * (10 + data[t].cash) * modify) / 4);
		$("#eff").html("Effectiveness: " + toPlaces((initial + modify) * 100, 2) + "%");
		$("#console").append("<p><b class = 'text-success'>" + toDate(currentDate) + " " + name + " concludes phase I trials of candidate " + trial + " with " + toPlaces((initial + modify) * 100, 2) + "% effectiveness (+" + toPlaces((initial + modify - eff) * 100, 2) + "%) and receives $" + toShort(funding, 2) + " in funds</b></p>");
		$(".leading").removeClass("leading");
		$("#candidate" + trial).addClass("leading");
		eff = initial + modify;
		money += funding;
		dmoney = funding;
		rf += funding;
		updateMoney();
		if (eff >= 0.7) {
			$("#d1 p").html("<button class = 'btn btn-primary btn-sm' onclick = 'javascript:phaseTwo(\"" + trial + "\", " + eff + ")'>Select Candidate " + trial + " for Phase II</button>");
		}
	} else {
		$("#console").append("<p><b class = 'text-danger'>" + toDate(currentDate) + " " + name + " concludes phase I trials of candidate " + trial + " with " + toPlaces((initial + modify) * 100, 2) + "% effectiveness (-" + toPlaces((-100 * (initial + modify - eff)), 2) + "%)</b></p>");
		if (cf2 == trial) {
			$(".leading").removeClass("leading");
			if (initial + modify < 0.7) {
				$("#d1 p button").remove();
			} else {
				$("#d1 p").html("<button class = 'btn btn-primary btn-sm' onclick = 'javascript:phaseTwo(\"" + trial + "\", " + (initial + modify) + ")'>Select Candidate " + trial + " for Phase II</button>");
			}
		}
	}
	$("#console").append("<p><b class = 'text-warning'>Results of Candidate " + trial + " phase I trial:" + results + "</b></p>");
	$("#console").scrollTop($("#console").prop("scrollHeight"));
	delete trials_1[t];
}
function trialOne(country, lvl, c) {
	var candidate = (typeof c == "undefined" ? $("#candidate").val() : c);
	$("#candidate" + candidate + " select").attr("disabled", "true");
	$("#candidate" + candidate + " td:last-child").html("<img src = 'flags/" + country + ".png' style = 'height: 1em; position: relative; top: -1px; border: 0.5px solid rgba(0, 0, 0, 0.3)' class = 'mr-2'> " + (7 * (5 - lvl)) + " days left");
	trials_1[country] = { "time": 7 * (5 - lvl), "candidate": candidate }
	money -= 500000;
	dmoney = -500000;
	rc += 500000;
	updateMoney();
	$("#country").modal("hide");
	$("#console").append("<p><b class = 'text-success'>" + toDate(currentDate) + " " + name + " begins Phase I trials of Candidate " + candidate + " at its " + data[country].demonym + " facility</b></p>");
	$("#console").scrollTop($("#console").prop("scrollHeight"));
}

function validCandidate() {
	if ($("#candidate").val() != "null" && money >= 500000) {
		$("#runOne").removeAttr("disabled");
	} else {
		$("#runOne").attr("disabled", "true");
	}
}
function requestFunds(country) {
	money += data[country].cash * 300000 * cleared.length;
	dmoney = data[country].cash * 300000 * cleared.length;
	rc += data[country].cash * 300000 * cleared.length;
	updateMoney();
	for (var j in relations) {
		if (relations[j] - (0.2 * (loans + 1)) > 1) {
			relations[j] -= (0.2 * (loans + 1));
		} else {
			relations[j] = 1;
		}
		$("#" + j + "_r").html("WTC " + toPlaces(relations[j], 1) + " / 10");
	}
	loans++;
	$("#console").append("<p><b class = 'text-warning'>" + toDate(currentDate) + " " + name + " requests funds from the " + data[country].demonym + " government</b></p>");
	$("#console").scrollTop($("#console").prop("scrollHeight"));
	$("#country").modal("hide");
}
function setManufacture(f, event) {
	var country = facilities[f][0];
	var toMake = Number($("#makei").val());
	var max = toPlaces(((data[facilities[f][0]].cash * 0.6) ** facilities[f][1]) * 80000, -1);
	if (typeof event == "undefined" || (typeof event != "undefined" && event.keyCode == 13 && !isNaN(toMake) && toMake >= 0 && toMake <= max && toMake % 1 == 0)) {
		facilities[f][2] = toMake;
		$("#country").modal("hide");
		if (facilities[f][2] == 0) {
			$("#console").append("<p><b class = 'text-primary'>" + toDate(currentDate) + " " + name + " to cease manufacturing at its " + data[country].demonym + " facility</b></p>");
		} else {
			$("#console").append("<p><b class = 'text-primary'>" + toDate(currentDate) + " " + name + " to manufacture " + toShort(toMake, 2) + " doses per day at its " + data[country].demonym + " facility</b></p>");
		}
		$("#console").scrollTop($("#console").prop("scrollHeight"));
	}
}
function makeValid(input, f) {
	if (input) {
		var toMake = Number($("#makei").val());
		var max = toPlaces(((data[facilities[f][0]].cash * 0.6) ** facilities[f][1]) * 80000, -1);
		if (!isNaN(toMake) && toMake >= 0 && toMake <= max && toMake % 1 == 0) {
			$("#makes").val(toMake);
			$("#makel").html(toShort(toMake, 3));
			$("#setMake").removeAttr("disabled");
			$("#setMake").html("Set Daily Manufacture - $" + toShort(15 * toMake, 2) + "/day");
		} else {
			$("#setMake").attr("disabled", "true");
		}
	} else {
		$("#makei").val(toPlaces(Number($("#makes").val()), -1));
		$("#makel").html(toShort(Number($("#makes").val()), 3));
		$("#setMake").removeAttr("disabled");
		$("#setMake").html("Set Daily Manufacture - $" + toShort(15 * Number($("#makei").val()), 2) + "/day");
	}
}
function setDelivery(country, event) {
	var cname = (country == "usa" || country == "gbr" ? "the " : "") + data[country].country;
	var toDeliver = Number($("#dosei").val());
	var max = toPlaces(0.0001 * (data[country].cash ** (relations[country] - 8)) * data[country].pop, -1);
	if (max > (data[country].st * data[country].pop)) {
		max = toPlaces(data[country].st * data[country].pop, -1);
	}
	if (typeof event == "undefined" || (typeof event != "undefined" && event.keyCode == 13 && !isNaN(toDeliver) && toDeliver >= 0 && toDeliver <= max && toDeliver % 1 == 0)) {
		deliveries[country] = toDeliver;
		$("#country").modal("hide");
		if (toDeliver != 0) {
			$("#console").append("<p><b class = 'text-primary'>" + toDate(currentDate) + " " + name + " signs agreement with " + data[country].demonym + " government to deliver " + toShort(toDeliver, 2) + " doses per day to " + cname + "</b></p>");
		} else {
			$("#console").append("<p><b class = 'text-primary'>" + toDate(currentDate) + " " + name + " terminates delivery agreement with " + data[country].demonym + " government</b></p>");
		}
		$("#console").scrollTop($("#console").prop("scrollHeight"));
	}
}
function deliveryValid(input) {
	if (input) {
		var toDeliver = Number($("#dosei").val());
		var max = toPlaces(0.0001 * (data[country].cash ** (relations[country] - 8)) * data[country].pop, -1);
		if (max > (data[country].st * data[country].pop)) {
			max = toPlaces(data[country].st * data[country].pop, -1);
		}
		if (!isNaN(toDeliver) && toDeliver >= 0 && toDeliver <= max && toDeliver % 1 == 0) {
			$("#doses").val(toDeliver);
			$("#dosel").html(toShort(toDeliver, 3));
			$("#setDelivery").removeAttr("disabled");
			$("#setDelivery").html("Set Daily Delivery (+$" + toShort(20 * toDeliver, 2) + "/day)");
		} else {
			$("#setDelivery").attr("disabled", "true");
		}
	} else {
		$("#dosei").val(toPlaces(Number($("#doses").val()), -1));
		$("#dosel").html(toShort(Number($("#doses").val()), 3));
		$("#setDelivery").html("Set Daily Delivery (+$" + toShort(20 * toPlaces(Number($("#doses").val()), -1), 2) + "/day)");
		$("#setDelivery").removeAttr("disabled");
	}
}
function dosageValid(input) {
	if (input) {
		var dosage = toPlaces(Number($("#di").val()) * 100, 1);
		if (!isNaN(dosage) && dosage >= 25 && dosage <= 100) {
			$("#ds").val(dosage);
			if (money >= 1000000) {
				$("#runTwo").removeAttr("disabled", "true");
			} else {
				$("#runTwo").attr("disabled", "true");
			}
		} else {
			$("#runTwo").attr("disabled", "true");
		}
	} else {
		$("#di").val(toPlaces($("#ds").val() / 100, 2) + ($("#ds").val() == 100 ? ".0" : ""));
		if (money >= 1000000) {
			$("#runTwo").removeAttr("disabled", "true");
		} else {
			$("#runTwo").attr("disabled", "true");
		}
	}
}
function countryModal(country) {
	var cname = (country == "usa" || country == "gbr" ? "the " : "") + data[country].country;
	var cn = (country == "usa" || country == "gbr" ? "The " : "") + data[country].country;
	$("#" + country).blur();
	$("#country h5").html(data[country].country + " <img src = 'flags/" + country + ".png' style = 'height: 1.1em; position: relative; top: -1px; border: 0.5px solid rgba(0, 0, 0, 0.3)' class = 'ml-2'>");
	$("#country .modal-body").empty();
	var found = -1;
	for (var i = 0; i < facilities.length; i++) {
		if (facilities[i][0] == country) {
			found = i;
			break;
		}
	}
	if (won) {
		$("#country .modal-body").append("<div class = 'alert alert-success text-center mb-0'>" + cn + " was declared virus-free on " + toDate(data[country].safe) + "</div>");
	} else {
		if (cleared.length >= 3) {
			if (!data[country].approved) {
				$("#country .modal-body").append("<h6>Licensure</h6><p>Your vaccine has not been approved for use in " + cname + ".</p><hr class = 'my-3'>");
			} else {
				if (data[country].safe != false) {
					$("#country .modal-body").append("<div class = 'alert alert-success text-center'>" + cn + " was declared virus-free on " + toDate(data[country].safe) + "</div><hr class = 'my-3'>");
				} else {
					$("#country .modal-body").append("<h6>Licensure</h6><p>Your vaccine has been approved for use in " + cname + ".</p>");
					if (cleared.length == 4) {
						$("#country .modal-body h6:first-child").html("Licensure & Distribution");
						var demand = toPlaces(0.0001 * (data[country].cash ** (relations[country] - 8)) * data[country].pop, -1);
						if (demand > (data[country].st * data[country].pop)) {
							demand = toPlaces(data[country].st * data[country].pop, -1);
						}
						$("#country .modal-body").append("<p>The " + data[country].demonym + " government would currently like to order " + toShort(demand, 3) + " vaccine doses per day. As each dose costs $20 to buy, they will pay you up to $" + toShort(20 * demand, 2) + " daily for this order.</p><p>You can designate the number of doses that you would like to deliver to " + cname + " per day. If you do not have enough doses to deliver this amount on a day, then as many doses as possible will be delivered.</p><p>Enter the number of doses that you would like to be sent to " + cname + " per day (maximum " + toShort(demand, 3) + "):</p>");
						$("#country .modal-body").append("<p class = 'mt-3'><input type = 'text' value = '" + deliveries[country] + "' class = 'form-control form-control-sm mr-2 text-center' size = '13' maxlength = '8' id = 'dosei' placeholder = 'Doses per day' oninput = 'deliveryValid(true, \"" + country + "\")' onkeydown = 'setDelivery(\"" + country + "\", event)'><input type = 'range' class = 'custom-range ml-4' min = '0' max = '" + demand + "' step = '10' id = 'doses' value = '" + deliveries[country] + "' oninput = 'deliveryValid(false, \"" + country + "\")' onkeydown = 'setDelivery(\"" + country + "\", event)'><span class = 'ml-3' id = 'dosel'>" + toShort(deliveries[country], 3) + "</span><br><button class = 'btn btn-sm btn-primary mt-3' id = 'setDelivery' disabled onclick = 'javascript:setDelivery(\"" + country + "\")'>Set Daily Delivery (+$" + toShort(20 * deliveries[country], 2) + "/day)</button></p><hr class = 'my-3'>");
					} else {
						$("#country .modal-body").append("<hr class = 'my-3'>");
					}
				}
			}
		}
		if (found == -1) {
			const facilitycost = ((data[country].cash / 5) + (2.25 ** (4 - relations[country])) - 1) * 100000;
			$("#country .modal-body").append("<h6>Facility</h6><p>Establishing a facility in " + cname + " will cost $" + toShort(facilitycost, 2) + ".</p><p>Establishing a facility here will:</p><ul><li>Allow research to be performed here</li><li>Allow clinical trials to be run here</li><li>Allow vaccine doses to be manufactured here</li><li>Affect your WTC with other countries</li><li>Increase your research & operations costs</li></ul>");
			$("#country .modal-body").append("<p><button class = 'btn btn-primary btn-sm' " + (money < facilitycost ? "disabled" : "") + " onclick = 'javascript:establishFacility(\"" + country + "\")'>Establish Facility - $" + toShort(facilitycost, 2) + "</button></p>");
		} else {
			if (cleared.length == 4) {
				var max = toPlaces(((data[country].cash * 0.6) ** facilities[found][1]) * 80000, -1);
				$("#country .modal-body").append("<h6>Manufacturing</h6><p>Your Level " + facilities[found][1] + " facility in " + cname + " can currently manufacture " + toShort(max, 3) + " doses per day.</p>");
				$("#country .modal-body").append("<p>Each dose costs $15 to manufacture, so manufacturing this maximum amount daily will cost $" + toShort(15 * max, 2) + ".</p><p>You can designate the number of doses that you would like to manufacture per day. If you do not have enough money to manufacture this amount on a day, then manufacturing will pause.</p><p>Enter the number of doses that you would like to manufacture at this facility per day (maximum " + toShort(max, 3) + "):</p>");
				$("#country .modal-body").append("<p class = 'mt-3'><input type = 'text' value = '" + facilities[found][2] + "' class = 'form-control form-control-sm mr-2 text-center' size = '13' maxlength = '8' id = 'makei' placeholder = 'Doses per day' oninput = 'makeValid(true, " + found + ")' onkeydown = 'setManufacture(" + found + ", event)'><input type = 'range' class = 'custom-range ml-4' min = '0' max = '" + max + "' step = '10' id = 'makes' value = '" + facilities[found][2] + "' oninput = 'makeValid(false, " + found + ")' onkeydown = 'setManufacture(" + found + ", event)'><span class = 'ml-3' id = 'makel'>" + toShort(facilities[found][2], 3) + "</span><br><button class = 'btn btn-sm btn-primary mt-3' id = 'setMake' disabled onclick = 'javascript:setManufacture(" + found + ")'>Set Daily Manufacture - $" + toShort(15 * facilities[found][2], 2) + "/day</button></p><hr class = 'my-3'>");
			} else if (cleared.length == 3) {
				if (typeof trials_3[country] != "undefined") {
					$("#country .modal-body").append("<h6>Phase III trials</h6><p>Phase III trials are ongoing at this facility and will require " + (trials_3[country].time == 1 ? "1 more day" : (trials_3[country].time + " more days")) + " to complete.</p><hr class = 'my-3'>");
				} else {
					$("#country .modal-body").append("<h6>Phase III trials</h6><p>Phase III trials can now be run at this facility.</p><p>These large-scale trials will be used to determine your vaccine's final effectiveness and safety. Successful trial results may allow you to obtain a license from governments.</p><p>Your Level " + facilities[found][1] + " facility will take " + (5 - facilities[found][1]) + " weeks to run this Phase III trial.</p>");
					$("#country .modal-body").append("<p class = 'mt-3'><button class = 'btn btn-sm btn-primary' id = 'runThree'" + (money < 3000000 ? " disabled" : "") + " onclick = 'javascript:trialThree(\"" + country + "\", " + facilities[found][1] + ")'>Run Phase III Trial - $3M</button></p><hr class = 'my-3'>");
				}
			} else if (cleared.length == 2) {
				if (typeof trials_2[country] != "undefined") {
					$("#country .modal-body").append("<h6>Phase II trials</h6><p>Phase II trials of " + (trials_2[country].dd) + " dosage are ongoing at this facility and will require " + (trials_2[country].time == 1 ? "1 more day" : (trials_2[country].time + " more days")) + " to complete.</p><hr class = 'my-3'>");
				} else {
					$("#country .modal-body").append("<h6>Phase II trials</h6><p>Phase II trials can now be run at this facility.</p><p>These trials will include people who are at risk of infection and will be used to test the effectiveness of a certain vaccine dosage.</p><p>Your Level " + facilities[found][1] + " facility will take " + (5 - facilities[found][1]) + " weeks to run this Phase II trial.</p>");
					$("#country .modal-body").append("<p class = 'mt-3'><input type = 'text' class = 'form-control form-control-sm mr-2 text-center' size = '7' maxlength = '4' id = 'di' placeholder = '0.25-1.0' oninput = 'dosageValid(true)' onkeydown = 'trialTwo(\"" + country + "\", " + facilities[found][1] + ", event)'>mL<input type = 'range' class = 'custom-range ml-4' min = '25' max = '100' step = '0.1' id = 'ds' value = '25.0' oninput = 'dosageValid(false)' onkeydown = 'trialTwo(\"" + country + "\", " + facilities[found][1] + ", event)'><br><button class = 'btn btn-sm btn-primary mt-3' id = 'runTwo' disabled onclick = 'javascript:trialTwo(\"" + country + "\", " + facilities[found][1] + ")'>Run Phase II Trial - $1M</button></p><hr class = 'my-3'>");
				}
			} else if (cleared.length == 1) {
				if (typeof trials_1[country] != "undefined") {
					$("#country .modal-body").append("<h6>Phase I trials</h6><p>Phase I trials of Candidate " + trials_1[country].candidate + " are ongoing at this facility and will require " + (trials_1[country].time == 1 ? "1 more day" : (trials_1[country].time + " more days")) + " to complete.</p><hr class = 'my-3'>");
				} else {
					$("#country .modal-body").append("<h6>Phase I trials</h6><p>Phase I trials can now be run at this facility.</p><p>These trials will be conducted on healthy adult volunteers and will be used to test the effectiveness of potential vaccine excipients.</p><p>Your Level " + facilities[found][1] + " facility will take " + (5 - facilities[found][1]) + " weeks to run this Phase I trial.</p>");
					$("#country .modal-body").append("<p class = 'mt-3'><select class = 'custom-select custom-select-sm mr-3' style = 'width: auto !important' id = 'candidate' onchange = 'validCandidate()' " + (money < 50000 ? "disabled" : "") + "><option value = 'null' selected disabled>Candidate...</option></select><button class = 'btn btn-primary btn-sm' disabled onclick = 'javascript:trialOne(\"" + country + "\", " + facilities[found][1] + ")' id = 'runOne'>Run Phase I Trial - $500K</button></p><hr class = 'my-3'>");
					var none = true;
					for (var j in candidates) {
						var valid = true;
						for (var k = 0; k < additions.length; k++) {
							if ($("#" + j + k).val() == null) {
								valid = false;
							} else {
								candidates[j][k] = Number($("#" + j + k).val());
							}
						}
						for (var l in trials_1) {
							if (trials_1[l].candidate == j) {
								valid = false;
								none = false;
								break;
							}
						}
						if (valid) {
							$("#candidate").append("<option value = '" + j + "'>Candidate " + j + "</option>");
							none = false;
						}
					}
					if (none) {
						$("#candidate").attr("disabled", "true");
						$("#candidate").html("<option value = 'null' selected disabled>No valid candidates</option>")
					}
				}
			}
			const upgradecost = ((data[country].cash / 5) + (2.25 ** (4 - relations[country] + facilities[found][1])) - 1) * 100000 * 2;
			$("#country .modal-body").append("<h6>Facility</h6><p>" + name + " currently has a Level " + facilities[found][1] + " facility in " + cname + "." + (found == 0 ? (" This facility is also the headquarters of " + name + ".") : "") + "</p>");
			$("#country .modal-body").append("<p>The " + (facilities[found][1] * 10) + (cleared.length == 4 ? " workers" : " researchers") + " at this facility are each being paid $" + (per_c == 1 ? 0 : toShort(data[facilities[found][0]].cash * 10000 / 365, 2)) + " per day for a total of $" + (per_c == 1 ? 0 : toShort((facilities[found][1] * 10) * data[facilities[found][0]].cash * 10000 / 365, 2)) + ".</p>");
			if (facilities[found][1] < 3) {
				$("#country .modal-body").append("<p>Upgrading this facility to Level " + (facilities[found][1] + 1) + " will cost $" + toShort(upgradecost, 2) + " and will:</p><ul class = 'mb-0'><li>Increase its research speed</li><li>Increase the speed at which clinical trials take place</li><li>Increase its manufacturing capabilities</li><li>Increase its research & operations costs</li><li>Increase this country's WTC</li></ul><p class = 'mb-3'>Upgrading a facility will not shorten the duration of any currently ongoing clinical trials.</p>");
				$("#country .modal-body").append("<p><button class = 'btn btn-primary btn-sm' " + (money < upgradecost ? "disabled" : "") + " onclick = 'javascript:upgradeFacility(\"" + country + "\")'>Upgrade Facility to Level " + (facilities[found][1] + 1) + " - $" + toShort(upgradecost, 2) + "</button></p>");
			} else {
				$("#country .modal-body").append("<p>This facility is already at Level 3, the maximum level.</p>");
			}
			if (cleared.length > 0 && country == facilities[0][0]) {
				$("#country .modal-body").append("<hr class = 'my-3'><h6>Research funding</h6><p>You may request $" + toShort(data[country].cash * 300000 * cleared.length, 2) + " from the " + data[country].demonym + " government at a cost of -" + ((loans + 1) * 0.2) + " WTC with all countries.</p><p class = 'mt-3 mb-2'><button class = 'btn btn-danger btn-sm' onclick = 'javascript:requestFunds(\"" + country + "\")'>Request Funds (+$" + toShort(data[country].cash * 300000 * cleared.length, 2) + ")</button></p>");
			}
		}
	}
	$("#country").modal();
}

for (var i = 0; i < (COUNT ** 0.5); i++) {
	var append_c = "";
	var append_p = "";
	var code_c = "";
	var code_p = "";
	for (var j = 0; j < (COUNT ** 0.5); j++) {
		append_c += "<td id = 'c" + ((i * (COUNT ** 0.5)) + j) + "'>&bull;&bull;&bull;</td>";
		code_c += "<td onclick = 'javascript:selectProtein(\"" + ((i * (COUNT ** 0.5)) + j) + "\")'><input style = 'margin-right: 4px' type = 'text' size = '3' id = 'cc" + ((i * (COUNT ** 0.5)) + j) + "' value = '&bull;&bull;&bull;' readonly></td>";
		append_p += "<td style = 'padding: 1px 2px' id = 'p" + ((i * (COUNT ** 0.5)) + j) + "'>&bull;</td>";
		code_p += "<td><input style = 'margin-left: 4px; padding: 1px 5px' type = 'text' size = '1' maxlength = '1' id = 'cp" + ((i * (COUNT ** 0.5)) + j) + "' value = '' onfocus = 'selectCodon(\"" + ((i * (COUNT ** 0.5)) + j) + "\")' onblur = 'deselectCodon(\"" + ((i * (COUNT ** 0.5)) + j) + "\")' onchange = 'changed(\"" + ((i * (COUNT ** 0.5)) + j) + "\")'></td>";
	}
	$("#mini-c").append("<tr>" + append_c + "</tr>");
	$("#code-c").append("<tr>" + code_c + "</tr>");
	$("#mini-p").append("<tr>" + append_p + "</tr>");
	$("#code-p").append("<tr>" + code_p + "</tr>");
}

var count = 0;
var append = "<div class = 'card-deck mb-3'>";
for (var country in data) {
	data[country].approved = false;
	data[country].doses = 0;
	data[country].vt = 0;
	data[country].safe = false;
	deliveries[country] = 0;
	countries++;
	var x = data[country];
	var b = x.b;
	var k = x.k;
	data[country].st = (x.pop - x.cc) / x.pop;
	data[country].it = x.nc / (x.pop * b * data[country].st);
	data[country].rt = 1 - data[country].st - data[country].it;
	append += "<div class = 'card text-center' id = '" + country + "' tabindex = '1' title = 'Keyboard Shortcut: " + data[country].ks + "' onclick = 'javascript:countryModal(\"" + country + "\")'><div class = 'card-body p-2 text-center'><h6 class = 'card-title'>" + x.country + "</h6><p class = 'mt-2 mb-2'><img src = 'flags/" + country + ".png'></p><p class = 'mb-0'>" + ((country == "chn" || country == "ind") ? toShort(x.pop, 2) : toShort(x.pop, 1)) + "</p></div><ul class = 'list-group list-group-flush'><li class = 'list-group-item list-group-item-danger' id = '" + country + "_i'>(+" + toShort(x.nc, 2) + ") " + toShort(x.cc, 2) + "</li><li class = 'list-group-item list-group-item-dark' id = '" + country + "_d'>" + toShort(x.cd, 2) + "</li><li class = 'list-group-item list-group-item-success' id = '" + country + "_v'>-</li><li class = 'list-group-item list-group-item-primary' id = '" + country + "_r'>-</li></ul></div>";
	count++;
	if (count == 6) {
		count = 0;
		$("#countries").append(append + "</div>");
		append = "<div class = 'card-deck mb-3'>";
	}
}

for (var i = 0; i < facilities.length; i++) {
	$("#" + facilities[i][0]).addClass("facility-" + facilities[i][1]);
}
for (var j = 0; j < RELATIONS.length; j++) {
	if (RELATIONS[j].indexOf(facilities[0][0]) != -1) {
		$("#" + RELATIONS[j][(1 - RELATIONS[j].indexOf(facilities[0][0]))] + "_r").html("WTC " + RELATIONS[j][2] + " / 10");
		relations[RELATIONS[j][(1 - RELATIONS[j].indexOf(facilities[0][0]))]] = RELATIONS[j][2];
	}
}
$("#" + facilities[0][0] + "_r").html("WTC 6 / 10");
relations[facilities[0][0]] = 6;
money = data[facilities[0][0]].cash * 150000;
$("#cash").html("$" + toShort(money, 3));

var alpha = "ABCDEFGH";
function phaseOne() {
	$("#console").append("<p><b class = 'text-success'>" + toDate(currentDate) + " At " + toPlaces(eff * 100, 2) + "% effectiveness, " + data[facilities[0][0]].demonym + (facilities.length >= 2 ? " and other governments allow" : " government allows") + " phase I clinical trials to begin</b></p>");
	$("#console").append("<p><b class = 'text-success'>PRECLINICAL CLEARED IN: " + (Math.round(Math.abs((currentDate - new Date("June 1, 2020")) / (24 * 60 * 60 * 1000)))) + " days</b></p>");
	for (var i = 0; i < COUNT; i++) {
		$("#cc" + i).val(seq_c.charAt(3 * i) + seq_c.charAt(3 * i + 1) + seq_c.charAt(3 * i + 2));
		$("#c" + i).html(seq_c.charAt(3 * i) + seq_c.charAt(3 * i + 1) + seq_c.charAt(3 * i + 2));
	}
	per_c = 1;
	cleared[0] = new Date(currentDate.getTime());
	$("#dp input").attr("disabled", "true");
	$("#phase").html("Phase: I");
	$("#t1").removeClass("disabled");
	$("#t1").html("Phase I");
	$("#t1").tab("show");
	var count = 0;
	for (var h = 0; h < additions.length; h++) {
		var modifiers = [0.04, 0.02, 0, -0.02];
		for (var g = 0; g < additions[h].length; g++) {
			var modify = Math.floor(Math.random() * modifiers.length);
			additions[h][g][1] = modifiers[modify];
			modifiers.splice(modify, 1);
		}
	}
	for (var i = 0; i < facilities.length; i++) {
		for (var j = 0; j < facilities[i][1]; j++) {
			if (count == 8) {
				break;
			}
			$("#candidates").append("<tr id = 'candidate" + alpha.charAt(count) + "'><td>Candidate " + alpha.charAt(count) + "</td><td><select class = 'custom-select custom-select-sm' id = '" + alpha.charAt(count) + "0'><option selected disabled value = 'null'>Select...</option></select></td><td><select class = 'custom-select custom-select-sm'id = '" + alpha.charAt(count) + "1'><option selected disabled value = 'null'>Select...</option></select></td><td><select class = 'custom-select custom-select-sm'id = '" + alpha.charAt(count) + "2'><option selected disabled value = 'null'>Select...</option></select></td><td><select class = 'custom-select custom-select-sm'id = '" + alpha.charAt(count) + "3'><option selected disabled value = 'null'>Select...</option></select></td><td><select class = 'custom-select custom-select-sm' id = '" + alpha.charAt(count) + "4'><option selected disabled value = 'null'>Select...</option></select></td><td>?</td>");
			for (var k = 0; k < additions.length; k++) {
				for (var l = 0; l < additions[k].length; l++) {
					$("#" + alpha.charAt(count) + k).append("<option value = '" + l + "'>" + additions[k][l][0] + "</option>");
					candidates[alpha.charAt(count)] = [-1, -1, -1, -1, -1];
				}
			}
			count++;
		}
	}
}
var won = false;
function victory() {
	won = true;
	sessionStorage.setItem("rc", rc);
	sessionStorage.setItem("rf", rf);
	sessionStorage.setItem("dp", dp);
	$("#pause").html("paused");
	$("#pause").attr("disabled", "true");
	$("#cash").html("$" + toShort(money, 3));
	$("#dose").html(toShort(doses, 3));
	$("#console").append("<p><b class = 'text-success'>" + toDate(currentDate) + " World declared virus-free with thanks to the " + name + " vaccine</b></p>");
	$("#console").append("<p><b class = 'text-success'>VACCINATION CAMPAIGN TOOK: " + (Math.round(Math.abs((cleared[3] - currentDate) / (24 * 60 * 60 * 1000)))) + " days</b></p>");
	$("#console").append("<p><b class = 'text-success'>Congratulations! You have ended the pandemic and beat VAX. Click <a href = '#' onclick = 'javascript:endScreen()'>here</a> to proceed.</b></p>");
	cleared[cleared.length] = new Date(currentDate.getTime());
	sessionStorage.setItem("cleared", JSON.stringify(cleared));
	$("#console").scrollTop($("#console").prop("scrollHeight"));
	$("#victory").modal("show");
}
function endScreen() {
	hideWarning = true;
	$("#black").fadeIn(1200, function() {
		window.open("end.html", "_self");
	});
}
var who = false;
function updateVaccinations() {
	var approvals = 0;
	var free = 0;
	for (var country in data) {
		if (data[country].approved && !who) {
			approvals++;
		}
		if (approvals >= (countries / 2) && !who) {
			who = true;
			$("#console").append("<p><b class = 'text-success'>" + toDate(currentDate) + " WHO director-general endorses " + name + " vaccine</b></p>");
			for (var i in relations) {
				if (relations[i] + 0.3 < 10) {
					relations[i] += 0.3;
				} else {
					relations[i] = 10;
				}
				$("#" + i + "_r").html("WTC " + toPlaces(relations[i], 1) + " / 10");
			}
		}
		if (data[country].vt > 0.25 && data[country].safe == false && data[country].leader != false) {
			$("#console").append("<p><b class = 'text-success'>" + toDate(currentDate) + " " + data[country].demonym + " " + data[country].leader + " receives vaccine</b></p>");
			data[country].leader = false;
			for (var i in relations) {
				if (relations[i] + 0.1 < 10) {
					relations[i] += 0.1;
				} else {
					relations[i] = 10;
				}
				$("#" + i + "_r").html("WTC " + toPlaces(relations[i], 1) + " / 10");
			}
		}
		if (data[country].it == 0 && data[country].safe == false) {
			data[country].st = 0;
			data[country].safe = new Date(currentDate.getTime());
			$("#console").append("<p><b class = 'text-success'>" + toDate(currentDate) + " " + data[country].country + " declared virus-free</b></p>");
			for (var i in relations) {
				if (relations[i] + 0.5 < 10) {
					relations[i] += 0.5;
				} else {
					relations[i] = 10;
				}
				$("#" + i + "_r").html("WTC " + toPlaces(relations[i], 1) + " / 10");
				$("#" + country + "_r").html("Virus-free");
				$("#" + country + "_r").removeAttr("id");
			}
			relations[country] = 10;
		}
		if (data[country].safe != false ){
			free++;
		}
	}
	$("#console").scrollTop($("#console").prop("scrollHeight"));
	if (free == countries) {
		victory();
	}
}
function updateSpread() {
	for (var country in data) {
		var x = data[country];
		var b = x.b;
		var k = x.k;
		var dst = -1 * b * x.st * x.it;
		var drt = k * x.it;
		var dit = (b * x.st * x.it) - (k * x.it);
		var ddt = x.d * drt;
		var dvt = 0;
		if (x.doses > 0) {
			dst -= (x.doses * eff / x.pop);
			drt += (x.doses * eff / x.pop);
			dvt = (x.doses * eff / x.pop);
			data[country].doses = 0;
		}
		data[country].st += dst;
		if (data[country].st * data[country].pop < 1) {
			data[country].st = 0;
		}
		data[country].it += dit;
		if (data[country].it * data[country].pop < data[country].b) {
			data[country].it = 0;
		}
		data[country].rt += drt;
		data[country].vt += dvt;
		if (data[country].b + x.bt > x.k || data[country].bt > 0) {
			data[country].b += x.bt;
		}
		data[country].cc += (x.pop * (b * x.st * x.it));
		data[country].nd = (x.pop * ddt);
		data[country].cd += (x.pop * ddt);
		$("#" + country + "_i").html(((b * x.st * x.it) > 0 ? "(+" : "(") + toShort(data[country].pop * (b * x.st * x.it), 2) + ") " + toShort(data[country].cc, 2));
		$("#" + country + "_d").html((ddt > 0 ? "(+" : "(") + toShort(data[country].nd, 2) + ") " + toShort(data[country].cd, 2));
		if (x.approved) {
			if (x.safe != false) {
				$("#" + country + "_v").html("(0) " + toShort(x.vt * x.pop, 2));
			} else {
				$("#" + country + "_v").html("(+" + toShort(dvt * x.pop, 2) + ") " + toShort(x.vt * x.pop, 2));
			}
		}
	}
}

var currentDate = new Date("June 1, 2020");

function checkEvents() {
	for (var i = 0; i < events.length; i++) {
		var e = events[i];
		if (e.d0 < currentDate) {
			var chance = e.c0 + (Math.round(Math.abs((currentDate - e.d0) / (24 * 60 * 60 * 1000))) * e.ct);
			if (Math.random() <= chance) {
				if (e.desc !== "") {
					$("#console").append("<p><b class = 'text-info'>" + toDate(currentDate) + "</b> " + e.desc + "</p>");
					$("#console").scrollTop($("#console").prop("scrollHeight"));
				}
				for (var j = 0; j < e.effects.length; j++) {
					data[e.effects[j].country][e.effects[j].t] = e.effects[j].v;
				}
				for (var k = 0; k < e.e_effects.length; k++) {
					events[events.length] = e.e_effects[k];
					var futureDate = new Date(currentDate.getTime());
					for (var l = 0; l < e.e_effects[k].d0; l++) {
						futureDate.setDate(futureDate.getDate() + 1);
					}
					events[events.length - 1].d0 = futureDate;
				}
				events.splice(i, 1);
			}
		}
	}
}

function runTest() {
	$(".bonus").removeClass("bonus");
	$(".new.changed").removeClass("new");
	$(".changed").removeClass("changed");
	$(".right").removeClass("right");
	$(".wrong").removeClass("wrong");
	var c = "";
	for (var l = 0; l < COUNT; l++) {
		if ($("#cp" + l).val().toUpperCase != $("#cp" + l).val()) {
			$("#cp" + l).val($("#cp" + l).val().toUpperCase());
		}
		c += ($("#cp" + l).val() == "" ? " " : $("#cp" + l).val());
		$("#p" + l).html($("#cp" + l).val() == "" ? "&bull;" : $("#cp" + l).val());
	}
	var v = 0;
	for (var m = 0; m < c.length; m++) {
		if (c.charAt(m) == seq_p.charAt(m)) {
			v++;
			$("#cc" + m).addClass("right");
			$("#cp" + m).addClass("right");
			$("#cc" + m).attr("disabled", "true");
			$("#cp" + m).attr("disabled", "true");
		} else if (c.charAt(m) != " ") {
			$("#cc" + m).addClass("wrong");
			$("#cp" + m).addClass("wrong");
		}
	}
	var prev = per_p;
	per_p = v / COUNT;
	$("#pp").html(toPlaces(per_p * 100, 2) + "%");
	$("#eff").html("Effectiveness: " + toPlaces((per_p * initial) * 100, 2) + "%");
	if (eff == 0) {
		if (per_p < 0.2) {
			$("#console").append("<p><b class = 'text-danger'>" + toDate(currentDate) + " " + name + " runs first preclinical vaccine test; records " + toPlaces((per_p * initial) * 100, 2) + "% effectiveness. " + data[facilities[0][0]].demonym + " government 'disappointed' but still optimistic</b></p>");	
		} else {
			$("#console").append("<p><b class = 'text-success'>" + toDate(currentDate) + " " + name + " runs first preclinical vaccine test; records " + toPlaces((per_p * initial) * 100, 2) + "% effectiveness. " + data[facilities[0][0]].demonym + " government increases funding</b></p>");	
		}
	}
	eff = per_p * initial;
	if (per_p != 1 && eff > 0.4) {
		$("#console").append("<p><b class = 'text-success'>" + toDate(currentDate) + " " + name + " vaccine tested to be 40% effective. " + data[facilities[0][0]].demonym + " government commends " + name + " and international pharmaceutical community hails new breakthrough</b></p>");	
	} else if (per_p != 1 && eff > 0.2) {
		$("#console").append("<p><b class = 'text-success'>" + toDate(currentDate) + " " + name + " vaccine tested to be 20% effective. " + data[facilities[0][0]].demonym + " government increases funding and other countries begin to take notice</b></p>");	
	}
	$("#console").append("<p><b class = 'text-" + (per_p - prev <= 0 ? "danger" : "success") + "'>" + toDate(currentDate) + " You successfully sequenced " + toPlaces(per_p * 100, 2) + "% of proteins in the virus (which is " + toPlaces((per_p - prev) * 100, 2, true) + "% progress).</b></p>");
	money -= 20000;
	var funding = (data[facilities[0][0]].cash * 30000) * (3 ** (1 + per_p)) * (per_p - prev) * (1 - prev) * (((3 + data[facilities[0][0]].cash) * per_p) / 2);
	dmoney = -20000;
	rc += 20000;
	if (funding > 0) {
		money += funding;
		dmoney = funding;
		rf += funding;
	}
	updateMoney();
	$("#console").append("<p><b class = 'text-success'>" + toDate(currentDate) + " You were given $" + toShort(funding, 2) + " in funds for your progress.</b></p>");
	if (per_p == 1) {
		phaseOne();
	}
	$("#console").scrollTop($("#console").prop("scrollHeight"));
	for (var i in relations) {
		if (relations[i] + (2 * (per_p - prev)) < 7.2) {
			relations[i] += toPlaces(2 * (per_p - prev), 1);
		} else {
			relations[i] = 7.2;
		}
		$("#" + i + "_r").html("WTC " + toPlaces(relations[i], 1) + " / 10");
	}
	$("#research").modal("hide");
}

function updateResearch() {
	var counts = 0;
	for (var i = 0; i < facilities.length; i++) {
		counts += facilities[i][1];
	}
	for (var j = 0; j < counts; j++) {
		var c = "";
		for (var l = 0; l < COUNT; l++) {
			c += $("#c" + l).html();
		}
		var v = [];
		for (var m = 0; m < c.length; m++) {
			if (encodeURIComponent(c.charAt(m)) == "%E2%80%A2" || encodeURIComponent(c.charAt(m)) == encodeURIComponent("•"))  {
				v[v.length] = m;
			}
		}
		if (v.length == 0 && per_c != 1) {
			$("#console").append("<p><b class = 'text-success'>" + toDate(currentDate) + " " + name + " unlocks entire virus RNA sequence</b></p>");
			$("#console").scrollTop($("#console").prop("scrollHeight"));
			per_c = 1;
			$("#pc").html("100%");
		} else if (per_c != 1) {
			var h = v[Math.floor(Math.random() * v.length)];
			var t = $("#c" + Math.floor(h / 3)).html();
			var p = "";
			for (var q = 0; q < 3; q++) {
				if (q == (h % 3)) {
					p += seq_c.charAt(h);
				} else {
					p += t.charAt(q);
				}
			}
			$("#cc" + Math.floor(h / 3)).val(p);
			if (encodeURIComponent(p).indexOf("%E2%80%A2") == -1) {
				$("#cc" + Math.floor(h / 3)).addClass("new");
				$("#cp" + Math.floor(h / 3)).addClass("new");
			}
			$("#c" + Math.floor(h / 3)).html(p);
			per_c = ((COUNT * 3) - v.length) / (COUNT * 3);
			$("#pc").html(toPlaces(per_c * 100, 2) + "%");
			if (per_c == 0.5 || per_c == 0.75) {
				$("#console").append("<p><b class = 'text-success'>" + toDate(currentDate) + " " + name + " unlocks " + toPlaces(per_c * 100,0) + "% of virus RNA sequence</b></p>");
				$("#console").scrollTop($("#console").prop("scrollHeight"));
			}
		}
	}
}
function payResearchers() {
	var deduct = 0;
	for (var i = 0; i < facilities.length; i++) {
		deduct += (data[facilities[i][0]].cash * 10000 * (10 * facilities[i][1]) / 365);
	}
	money -= deduct;
	dmoney = -1 * deduct;
	rc += deduct;
	updateMoney();
}
function updateBonus() {
	var bonus = [];
	for (var i = 0; i < $("#code-c input.new:not(.changed):not(.right)").length; i++) {
	    bonus[bonus.length] = $("#code-c input.new:not(.changed):not(.right)")[i].id.substring(2);
	}
	var counts = 0;
	for (var j = 0; j < facilities.length; j++) {
		counts += facilities[j][1];
	}
	for (var k = 0; k < counts; k++) {
		if (Math.random() <= (counts * 0.03 + 0.1 + (bonus.length * 0.1 / COUNT))) {
			var target = bonus[Math.floor(Math.random() * bonus.length)];
			$("#cp" + target).val(seq_p.charAt(Number(target)));
			$("#p" + target).html("!");
			$("#cp" + target).addClass("bonus");
			$("#cc" + target).addClass("bonus");
		}
	}
}

function sequenceModal() {
	$("#tp").tab("show");
	$("#research").modal();
}

$("#gov").html(data[facilities[0][0]].demonym);
$("#loan button").html("Take Loan - $" + toShort((data[facilities[0][0]].cash / 2) * 100000 + 100000, 0));
function takeLoan() {
	money += (data[facilities[0][0]].cash / 2) * 100000 + 100000;
	dmoney = (data[facilities[0][0]].cash / 2) * 100000 + 100000;
	rc += (data[facilities[0][0]].cash / 2) * 100000 + 100000;
	updateMoney();
	for (var i in relations) {
		if (relations[i] - 1 < 1) {
			relations[i] = 1;
		} else {
			relations[i] -= 1;
		}
		$("#" + i + "_r").html("WTC " + toPlaces(relations[i], 1) + " / 10");
	}
	$("#console").append("<p><b class = 'text-danger'>" + toDate(currentDate) + " On the verge of bankruptcy, " + name + " accepts $" + toShort((data[facilities[0][0]].cash / 2) * 100000 + 100000, 0) + " loan from " + data[facilities[0][0]].demonym + " government</b></p>");
	$("#console").scrollTop($("#console").prop("scrollHeight"));
	$("#loan").modal("hide");
}

function researchModal() {
	$("#research").modal("show");
	switch (cleared.length) {
		case 0:
			$("#tp").tab("show");
			break;
		case 1:
			$("#t1").tab("show");
			break;
		case 2:
			$("#t2").tab("show");
			break;
		case 3:
			$("#t3").tab("show");
			break;
	}
}

var paused = true;
var waspaused = true;
function advanceDay() {
	currentDate.setDate(currentDate.getDate() + 1);
	$("#date").html(toDate(currentDate));
	if (toDate(currentDate) == "06/02/20") {
		$("#console").append("<p><b class = 'text-success'>" + toDate(currentDate) + " " + name + " sequences first virus RNA nucleotides</b></p>");
		$("#console").scrollTop($("#console").prop("scrollHeight"));
	}
	for (var i in trials_1) {
		if (trials_1[i].time > 0) {
			trials_1[i].time--;
			$("#candidate" + trials_1[i].candidate + " td:last-child").html("<img src = 'flags/" + i + ".png' style = 'height: 1em; position: relative; top: -1px; border: 0.5px solid rgba(0, 0, 0, 0.3)' class = 'mr-2'> " + (trials_1[i].time > 1 ? (trials_1[i].time + " days") : (trials_1[i].time + " day")) + " left");
			if (trials_1[i].time == 0) {
				trials_1[i].time = -1;
				resultsOne(i);
			}
		}
	}
	for (var i in trials_2) {
		if (trials_2[i].time > 0) {
			trials_2[i].time--;
			$("#dosage" + trials_2[i].num + " td:first-child").html("<img src = 'flags/" + i + ".png' style = 'height: 1em; position: relative; top: -1px; border: 0.5px solid rgba(0, 0, 0, 0.3)' class = 'mr-2'> " + (trials_2[i].time > 1 ? (trials_2[i].time + " days") : (trials_2[i].time + " day")) + " left");
			if (trials_2[i].time == 0) {
				trials_2[i].time = -1;
				resultsTwo(i);
			}
		}
	}
	for (var i in research) {
		if (research[i].time > 0) {
			research[i].time--;
			$("#upgrade" + research[i].x + research[i].y + " span").html((research[i].time > 1 ? (research[i].time + " days") : (research[i].time + " day")) + " left");
			if (research[i].time == 0) {
				research[i].time = -1;
				concludeResearch(i);
			}
		}
	}
	for (var i in trials_3) {
		if (trials_3[i].time > 0) {
			trials_3[i].time--;
			if (trials_3[i].time == 0) {
				trials_3[i].time = -1;
				resultsThree(i);
			}
		}
	}
	if (cleared.length == 4) {
		checkLicensure();
		updateDoses();
	} else {
		payResearchers();
	}
	checkEvents();
	updateSpread();
	updateVaccinations();
	if (per_c < 1) {
		updateResearch();
	}
	if (per_p < 1) {
		updateBonus();
	}
	if (money < 20000 || per_p == 1) {
		$("#runTest").attr("disabled", "true");
	} else {
		$("#runTest").removeAttr("disabled");
	}
	if (money <= 0) {
		money = 0;
		$("#loan").modal("show");
	}
}
var dateInterval;
var CLOCK = 1000;
$("#pause").click(function() {
	if (!paused && !won) {
		paused = true;
		waspaused = true;
		clearInterval(dateInterval);
		$("#pause").html("resume");
	} else if (!won) {
		paused = false;
		waspaused = false;
		clearInterval(dateInterval);
		dateInterval = setInterval(advanceDay, CLOCK);
		$("#pause").html("pause");
	}
	$("#pause").blur();
});
$("body").keydown(function(event) {
	if (document.hasFocus() && window.innerWidth >= 1000 && !event.metaKey && !event.ctrlKey) {
		if (event.keyCode == 27) {
			$(".close").trigger("click");
		}
		if ($(".modal.show").length == 0) {
			if (event.keyCode == 32 && !won) {
				event.preventDefault();
				$("#pause").trigger("click");
			}
			if (event.keyCode == 16) {
				researchModal();
			}
			if (event.keyCode == 49 && CLOCK != 2000) {
				CLOCK = 2000;
				clearInterval(dateInterval);
				if (!paused && !won) {
					clearInterval(dateInterval);
					dateInterval = setInterval(advanceDay, CLOCK);
				}
				$("#speed").html("(speed: x1)");
			}
			if (event.keyCode == 50 && CLOCK != 1000) {
				CLOCK = 1000;
				clearInterval(dateInterval);
				if (!paused && !won) {
					clearInterval(dateInterval);
					dateInterval = setInterval(advanceDay, CLOCK);
				}
				$("#speed").html("(speed: x2)");
			}
			if (event.keyCode == 51 && CLOCK != 667) {
				CLOCK = 667;
				clearInterval(dateInterval);
				if (!paused && !won) {
					clearInterval(dateInterval);
					dateInterval = setInterval(advanceDay, CLOCK);
				}
				$("#speed").html("(speed: x3)");
			}
			for (var i in data) {
				if (event.keyCode == data[i].kc) {
					countryModal(i);
				}
			}
		}
		if ($("#research").hasClass("show")) {
			if ($("#code-c input.active").length != 0 && event.keyCode == 13 && money >= 20000 && cleared.length == 0) {
				runTest();
			} else if (event.keyCode == 48) {
				$("#tp").tab("show");
			} else if (event.keyCode == 49 && cleared.length >= 1) {
				$("#t1").tab("show");
			} else if (event.keyCode == 50 && cleared.length >= 2) {
				$("#t2").tab("show");
			} else if (event.keyCode == 51 && cleared.length >= 3) {
				$("#t3").tab("show");
			}
		}
	}
});
$(".modal").on("show.bs.modal", function() {
	if (!waspaused) {
		paused = true;
		clearInterval(dateInterval)
		$("#pause").html("paused");
	}
});
$(".modal").on("hide.bs.modal", function() {
	if (!waspaused && !won) {
		paused = false;
		dateInterval = setInterval(advanceDay, CLOCK);
		$("#pause").html("pause");
	}
});

var hideWarning = false;
window.addEventListener("beforeunload", (event) => {
    if (!hideWarning) {
        event.preventDefault();
        event.returnValue = "";
    }
});

function restartGame(page) {
	hideWarning = true;
	$("#black").fadeIn(1200, function() {
		window.open(page + ".html", "_self");
	});
}

function shortcut(code) {
	if (typeof code == "undefined") {
		for (var i = 0; i < seq_p.length; i++) {
		    if ($("#cp" + i).hasClass("new")) { $("#cp" + i).val(seq_p.charAt(i)) }
		}
	} else if (code === 0) {
		for (var i = 0; i < seq_p.length; i++) {
		    $("#cp" + i).val(seq_p.charAt(i));
		}
		runTest();
	} else if (code === true) {
		var output = "";
		for (var i = 0; i < additions.length; i++) {
			for (var j = 0; j < additions[i].length; j++) {
				if (additions[i][j][1] == 0.04) {
					output += additions[i][j][0];
					$("#A" + i).val(j + "");
					if (i != additions.length - 1) {
						output += ", ";
					}
					break;
				}
			}
		}
		console.log(output);
	} else if (code === 1) {
		for (var i in trials_1) {
		    trials_1[i].time = 1;
		}
	} else if (code === 2) {
		for (var i in trials_2) {
		    trials_2[i].time = 1;
		}
	} else if (code === false) {
		for (var i in research) {
		    research[i].time = 1;
		}
	} else if (code === 3) {
		for (var i in trials_3) {
		    trials_3[i].time = 1;
		}
	}
}

$(document).ready(function() {
	$("#black").fadeOut(1200);
});