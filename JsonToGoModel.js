var json = {
    "name":"mmc",
    "url":"http://a.a.com",
    "address":{
        "city":"厦门",
        "country":"中国",
        "isShow":true,
        "index":0
    },
    "arrayBrowser":[{
        "name":"Google",
        "url":"http://www.google.com"
    },
    {
       "name":"Baidu",
       "url":"http://www.baidu.com"
   },
   {
       "name":"SoSo",
       "url":"http://www.SoSo.com"
   }]
}

const MIN_FIELD_COUNT = 2
var model = {}
D('json', json)

for (var k in model) {
	console.log('type ' + k + ' struct{')
	console.log(model[k] + '}')
}

function D(objname, obj) {
	objname = objname.replace(/(\w)/, function(v) {
		return v.toUpperCase()
	})
	while (model[objname] != undefined)
		objname += objname
		// if (model[objname]!=undefined)
		// 	return 'interface{}'
	model[objname] = '';
	for (var k in obj) {
		type = typeof obj[k]
		if (type == 'number')
			type = 'int'
		else if (type == 'boolean')
			type = 'bool'
		else if (type == 'object') {
			if (isArray(obj[k])) {
				if (obj[k].length == 0) {
					type = '[]interface{}'
				} else {
					if (isNullObject(obj[k][0])) {
						type = '[]interface{}'
					} else {
						type = '[]' + D(k, obj[k][0])
					}
				}
			} else {
				if (isNullObject(obj[k])) {
					type = 'interface{}'
				} else {
					type = D(k, obj[k])
				}
			}
		}
		model[objname] += (k.replace(/(\w)/, function(v) {
			return v.toUpperCase()
		}) + " " + type + " " + '`json:"' + k + '"`\n')
	}
	return objname
}

// for (var k in json) {
// 	type = typeof json[k]
// 	if (type == 'number')
// 		type = 'int'
// 	else if (type == 'boolean')
// 		type = 'bool'
// 	else if (type == 'object') {
// 		if (isArray(json[k])) {
// 			type = '[]interface{}'
// 		} else {
// 			type = 'interface{}'
// 		}
// 	}
// 	console.log(k.replace(/(\w)/, function(v) {
// 		return v.toUpperCase()
// 	}) + " " + type + " " + '`json:"' + k + '"`')
// }

function isNullObject(obj) {
	if (obj != null && obj != undefined) {
		var i = 0;
		for (var k in obj) {
			i++
		}
		if (i >= MIN_FIELD_COUNT)
			return false
	}
	return true
}

function isArray(obj) {
	return Object.prototype.toString.call(obj) === '[object Array]';
}