function toPercent(n) {
	return parseFloat(n).toFixed(5) + "%";
}
function toPlaces(n, x) {
	return Math.round((n + Number.EPSILON) * (10 ** x)) / (10 ** x);
}
function toShort(z, x) {
	if (z < 1000) {
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
	    if (z < 0) { return ("-" + n) } else { return n }
	}
}
function toDate(d) {
	return ((d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1)) + "/" + (d.getDate() < 10 ? "0" + d.getDate() : d.getDate()) + "/" + d.getFullYear().toString().substring(2));
}

var name = localStorage.getItem("company");
const initial = Number(localStorage.getItem("initial"));
var eff = 0;
var cleared = [];
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
        "kc": 65
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
        "kc": 66
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
        "kc": 82
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
        "kc": 75
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
        "kc": 69
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
        "kc": 76
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
        "kc": 78
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
        "kc": 70
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
        "kc": 71
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
        "kc": 85
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
        "kc": 84
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
        "kc": 73
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
        "kc": 72
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
        "kc": 77
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
        "kc": 67
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
        "kc": 68
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
        "kc": 90
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
        "kc": 80
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
var seq_c = localStorage.getItem("seq_c");
var seq_p = localStorage.getItem("seq_p");
var per_c = 0;
var per_p = 0;

function updateMoney() {
	if (money <= 0) {
		money = 0;
	}
	if (money < 20000 || per_p == 1) {
		$("#runTest").attr("disabled", "true");
	} else {
		$("#runTest").removeAttr("disabled");
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
}

function upgradeFacility(country) {
	for (var i = 0; i < facilities.length; i++) {
		if (facilities[i][0] == country) {
			money -= (((data[country].cash / 5) + (2.25 ** (4 - relations[country] + facilities[i][1])) - 1) * 100000 * 2);
			updateMoney();
			$("#" + country).removeClass("facility-" + facilities[i][1]);
			facilities[i][1]++;
			$("#" + country).addClass("facility-" + facilities[i][1]);
			if (relations[country] + 0.4 <= 7) {
				relations[country] += 0.4;
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
	money -= ((data[country].cash / 5) + (2.25 ** (4 - relations[country])) - 1) * 100000;
	updateMoney();
	$("#" + country).addClass("facility-1");
	relations[country] += toPlaces((2 / (facilities.length - 1)), 1);
	$("#" + country + "_r").html("WTC " + toPlaces(relations[country], 1) + " / 10");
	for (var j = 0; j < RELATIONS.length; j++) {
		if (RELATIONS[j].indexOf(country) != -1) {
			var current = relations[RELATIONS[j][(1 - RELATIONS[j].indexOf(country))]];
			var change = toPlaces(((1 / ((facilities.length - 1) + 0.5)) * (RELATIONS[j][2] - 3)), 1);
			if (!((current + change > 7 && change > 0) || (current - change < 1 && change < 0))) {
				relations[RELATIONS[j][(1 - RELATIONS[j].indexOf(country))]] += toPlaces(((1 / ((facilities.length - 1) + 0.5)) * (RELATIONS[j][2] - 3)), 1);
			}
			$("#" + RELATIONS[j][(1 - RELATIONS[j].indexOf(country))] + "_r").html("WTC " + toPlaces(relations[RELATIONS[j][(1 - RELATIONS[j].indexOf(country))]], 1) + " / 10");
		}
	}
	$("#country").modal("hide");
	$("#console").append("<p><b class = 'text-success'>" + toDate(currentDate) + " " + name + " establishes a new facility in " + (country == "usa" || country == "gbr" ? "the " : "") + data[country].country + "</b></p>");
	$("#console").scrollTop($("#console").prop("scrollHeight"));
}

function countryModal(country) {
	var cname = (country == "usa" || country == "gbr" ? "the " : "") + data[country].country;
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
	if (found == -1) {
		const facilitycost = ((data[country].cash / 5) + (2.25 ** (4 - relations[country])) - 1) * 100000;
		$("#country .modal-body").html("<h6>Facility</h6><p>Establishing a facility in " + cname + " will cost $" + toShort(facilitycost, 2) + ".</p><p>Establishing a facility here will:</p><ul><li>Allow research to be performed here</li><li>Allow clinical trials to be run here</li><li>Allow vaccine doses to be manufactured here</li><li>Affect your WTC with other countries</li><li>Increase your research & operations costs</li></ul>");
		$("#country .modal-body").append("<p><button class = 'btn btn-primary btn-sm' " + (money < facilitycost ? "disabled" : "") + " onclick = 'establishFacility(\"" + country + "\")'>Establish Facility - $" + toShort(facilitycost, 2) + "</button></p>");
	} else {
		const upgradecost = ((data[country].cash / 5) + (2.25 ** (4 - relations[country] + facilities[found][1])) - 1) * 100000 * 2;
		$("#country .modal-body").html("<h6>Facility</h6><p>" + name + " currently has a Level " + facilities[found][1] + " facility in " + cname + ".</p>");
		$("#country .modal-body").append("<p>The " + (facilities[found][1] * 10) + " researchers at this facility are each being paid $" + (per_c == 1 ? 0 : toShort(data[facilities[found][0]].cash * 10000 / 365, 2)) + " per day for a total of $" + (per_c == 1 ? 0 : toShort((facilities[found][1] * 10) * data[facilities[found][0]].cash * 10000 / 365, 2)) + ".</p>");
		if (facilities[found][1] < 3) {
			$("#country .modal-body").append("<p>Upgrading this facility to Level " + (facilities[found][1] + 1) + " will cost $" + toShort(upgradecost, 2) + " and will:<ul><li>Increase its research speed</li><li>Increase its manufacturing capabilities</li><li>Increase its research & operations costs</li><li>Increase this country's WTC</li></ul></p>");
			$("#country .modal-body").append("<p><button class = 'btn btn-primary btn-sm' " + (money < upgradecost ? "disabled" : "") + " onclick = 'upgradeFacility(\"" + country + "\")'>Upgrade Facility to Level " + (facilities[found][1] + 1) + " - $" + toShort(upgradecost, 2) + "</button></p>");
		} else {
			$("#country .modal-body").append("<p>This facility is already at Level 3, the maximum level.</p>");
		}
	}
	$("#country").modal();
}

for (var i = 0; i < 12; i++) {
	var append_c = "";
	var append_p = "";
	var code_c = "";
	var code_p = "";
	for (var j = 0; j < 12; j++) {
		append_c += "<td id = 'c" + ((i * 12) + j) + "'>&bull;&bull;&bull;</td>";
		code_c += "<td onclick = 'selectProtein(\"" + ((i * 12) + j) + "\")'><input style = 'margin-right: 4px' type = 'text' size = '3' id = 'cc" + ((i * 12) + j) + "' value = '&bull;&bull;&bull;' readonly></td>";
		append_p += "<td style = 'padding: 1px 2px' id = 'p" + ((i * 12) + j) + "'>&bull;</td>";
		code_p += "<td><input style = 'margin-left: 4px; padding: 1px 5px' type = 'text' size = '1' maxlength = '1' id = 'cp" + ((i * 12) + j) + "' value = '' onfocus = 'selectCodon(\"" + ((i * 12) + j) + "\")' onblur = 'deselectCodon(\"" + ((i * 12) + j) + "\")' onchange = 'changed(\"" + ((i * 12) + j) + "\")'></td>";
	}
	$("#mini-c").append("<tr>" + append_c + "</tr>");
	$("#code-c").append("<tr>" + code_c + "</tr>");
	$("#mini-p").append("<tr>" + append_p + "</tr>");
	$("#code-p").append("<tr>" + code_p + "</tr>");
}

var count = 0;
var append = "<div class = 'card-deck mb-3'>";
for (var country in data) {
	var x = data[country];
	var b = x.b;
	var k = x.k;
	data[country].st = (x.pop - x.cc) / x.pop;
	data[country].it = x.nc / (x.pop * b * data[country].st);
	data[country].rt = 1 - data[country].st - data[country].it;
	append += "<div class = 'card text-center' id = '" + country + "' tabindex = '1' title = 'Keyboard Shortcut: " + data[country].ks + "' onclick = 'countryModal(\"" + country + "\")'><div class = 'card-body p-2 text-center'><h6 class = 'card-title'>" + x.country + "</h6><p class = 'mt-2 mb-2'><img src = 'flags/" + country + ".png'></p><p class = 'mb-0'>" + ((country == "chn" || country == "ind") ? toShort(x.pop, 2) : toShort(x.pop, 1)) + "</p></div><ul class = 'list-group list-group-flush'><li class = 'list-group-item list-group-item-danger' id = '" + country + "_i'>(+" + toShort(x.nc, 2) + ") " + toShort(x.cc, 2) + "</li><li class = 'list-group-item list-group-item-dark' id = '" + country + "_d'>" + toShort(x.cd, 2) + "</li><li class = 'list-group-item list-group-item-success' id = '" + country + "_v'>-</li><li class = 'list-group-item list-group-item-primary' id = '" + country + "_r'>-</li></ul></div>";
	count++;
	if (count == 6) {
		count = 0;
		$("#countries").append(append + "</div>");
		append = "<div class = 'card-deck mb-3'>";
	}
}
var facilities = JSON.parse(localStorage.getItem("facilities"));
var relations = {};
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

function phaseOne() {
	cleared[0] = new Date(currentDate.getTime());
	$("#phase").html("Phase: I");
	$("#t1").removeClass("disabled");
	$("#t1").html("Phase I");
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
		data[country].st += dst;
		data[country].it += dit;
		data[country].rt += drt;
		if (data[country].b + x.bt > x.k || data[country].bt > 0) {
			data[country].b += x.bt;
		}
		data[country].nd = (x.pop * ddt);
		data[country].cd += (x.pop * ddt);
		$("#" + country + "_i").html((dst < 0 ? "(+" : "(") + toShort(-1 * x.pop * dst, 2) + ") " + toShort(x.pop - (x.pop * data[country].st), 2));
		$("#" + country + "_d").html((ddt > 0 ? "(+" : "(") + toShort(x.nd, 2) + ") " + toShort(x.cd, 2));
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
	$(".new.changed").removeClass("new");
	$(".changed").removeClass("changed");
	$(".right").removeClass("right");
	$(".wrong").removeClass("wrong");
	var c = "";
	for (var l = 0; l < 144; l++) {
		c += ($("#cp" + l).val() == "" ? " " : $("#cp" + l).val());
		$("#p" + l).html($("#cp" + l).val() == "" ? "&bull;" : $("#cp" + l).val());
	}
	var v = 0;
	for (var m = 0; m < c.length; m++) {
		if (c.charAt(m) == seq_p.charAt(m)) {
			v++;
			$("#cc" + m).addClass("right");
			$("#cp" + m).addClass("right");
		} else if (c.charAt(m) != " ") {
			$("#cc" + m).addClass("wrong");
			$("#cp" + m).addClass("wrong");
		}
	}
	var prev = per_p;
	per_p = v / 144;
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
	if (per_p == 1) {
		$("#console").append("<p><b class = 'text-success'>" + toDate(currentDate) + " At " + toPlaces(eff * 100, 2) + "% effectiveness, " + data[facilities[0][0]].demonym + (facilities.length >= 2 ? " and other governments allow" : " government allows") + " phase I clinical trials to begin</b></p>");
	} else if (eff > 0.4) {
		$("#console").append("<p><b class = 'text-success'>" + toDate(currentDate) + " " + name + " vaccine tested to be 40% effective. " + data[facilities[0][0]].demonym + " government commends " + name + " and international pharmaceutical community hails new breakthrough</b></p>");	
	} else if (eff > 0.2) {
		$("#console").append("<p><b class = 'text-success'>" + toDate(currentDate) + " " + name + " vaccine tested to be 20% effective. " + data[facilities[0][0]].demonym + " government increases funding and other countries begin to take notice</b></p>");	
	}
	$("#console").append("<p><b class = 'text-success'>" + toDate(currentDate) + " You successfully sequenced " + toPlaces(per_p * 100, 2) + "% of proteins in the virus (which is +" + toPlaces((per_p - prev) * 100, 2) + "% progress).</b></p>");
	money -= 20000;
	var funding = (data[facilities[0][0]].cash * 30000) * (3 ** (1 + per_p)) * (per_p - prev) * (1 - prev) * (((3 + data[facilities[0][0]].cash) * per_p) / 2);
	dmoney -= 20000;
	if (funding > 0) {
		money += funding;
		dmoney += funding;
	}
	updateMoney();
	$("#console").append("<p><b class = 'text-success'>" + toDate(currentDate) + " You were given $" + toShort(funding, 2) + " in funds for your progress.</b></p>");
	if (per_p == 1) {
		$("#console").append("<p><b class = 'text-success'>PRECLINICAL CLEARED IN: " + (Math.round(Math.abs((currentDate - new Date("June 1, 2020")) / (24 * 60 * 60 * 1000)))) + " days</b></p>");
		phaseOne();
	}
	$("#console").scrollTop($("#console").prop("scrollHeight"));
	for (var i in relations) {
		if (relations[i] + (2 * (per_p - prev)) < 7.2) {
			relations[i] += toPlaces(2 * (per_p - prev), 1);
			$("#" + i + "_r").html("WTC " + toPlaces(relations[i], 1) + " / 10");
		}
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
		for (var l = 0; l < 144; l++) {
			c += $("#c" + l).html();
		}
		var v = [];
		for (var m = 0; m < c.length; m++) {
			if (c.charAt(m) == $("#bull").html()) {
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
			if (p.indexOf($("#bull").html()) == -1) {
				$("#cc" + Math.floor(h / 3)).addClass("new");
				$("#cp" + Math.floor(h / 3)).addClass("new");
			}
			$("#c" + Math.floor(h / 3)).html(p);
			per_c = ((144 * 3) - v.length) / (144 * 3);
			$("#pc").html(toPlaces(per_c * 100, 2) + "%");
			if (per_c == 0.25 || per_c == 0.5 || per_c == 0.75) {
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
	updateMoney();
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
	updateMoney();
	for (var i in relations) {
		if (relations[i] - 1 < 1) {
			relations[i] = 1;
		} else {
			relations[i] -= 1;
		}
		$("#" + country + "_r").html("WTC " + toPlaces(relations[country], 1) + " / 10");
	}
	$("#console").append("<p><b class = 'text-danger'>" + toDate(currentDate) + " On the verge of bankruptcy, " + name + " accepts $" + toShort((data[facilities[0][0]].cash / 2) * 100000 + 100000, 0) + " loan from " + data[facilities[0][0]].demonym + " government</b></p>");
	$("#loan").modal("hide");
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
	checkEvents();
	updateSpread();
	if (per_c < 1) {
		updateResearch();
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
	payResearchers();
}
var dateInterval;
var CLOCK = 2000;
$("#pause").click(function() {
	if (!paused) {
		paused = true;
		waspaused = true;
		clearInterval(dateInterval);
		$("#pause").html("resume");
	} else {
		paused = false;
		waspaused = false;
		dateInterval = setInterval(advanceDay, CLOCK);
		$("#pause").html("pause");
	}
	$("#pause").blur();
});
$("body").keydown(function(event) {
	if (document.hasFocus()) {
		if (event.keyCode == 220) {
			if (!document.webkitIsFullScreen) {
				document.documentElement.requestFullscreen();
			} else {
				document.exitFullscreen();
			}
		}
		if ($(".modal.show").length == 0) {
			if (event.keyCode == 32) {
				$("#pause").trigger("click");
			}
			if (event.keyCode == 16) {
				$("#research").modal("show");
			}
			if (event.keyCode == 49 && CLOCK != 3000) {
				CLOCK = 3000;
				clearInterval(dateInterval);
				if (!paused) {
					dateInterval = setInterval(advanceDay, CLOCK);
				}
				$("#speed").html("(speed: x1)");
			}
			if (event.keyCode == 50 && CLOCK != 2000) {
				CLOCK = 2000;
				clearInterval(dateInterval);
				if (!paused) {
					dateInterval = setInterval(advanceDay, CLOCK);
				}
				$("#speed").html("(speed: x2)");
			}
			if (event.keyCode == 51 && CLOCK != 1000) {
				CLOCK = 1000;
				clearInterval(dateInterval);
				if (!paused) {
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
		if ($("#research").hasClass("show") && $("#tp").hasClass("active") && event.keyCode == 13 && money >= 20000) {
			runTest();
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
	if (!waspaused) {
		paused = false;
		dateInterval = setInterval(advanceDay, CLOCK);
		$("#pause").html("pause");
	}
});

hideWarning = false;
window.addEventListener("beforeunload", (event) => {
    if (!hideWarning) {
        event.preventDefault();
        event.returnValue = "";
    }
});

$("#fullscreen").click(function() {
	if (!document.webkitIsFullScreen) {
		document.documentElement.requestFullscreen();
	} else {
		document.exitFullscreen();
	}
});