function inherit(obj) {
	if (Object.create) {
		return Object.create(obj);
	} else if (typeof obj != 'function' && typeof obj != 'object') {
		function f() {};
		f.prototype = obj;
		return new f();
	};
}

function getEventPosition(ev) {
	var x, y;
	if (ev.layerX || ev.layerX == 0) {
		x = ev.layerX;
		y = ev.layerY;
	} else if (ev.offsetX || ev.offsetX == 0) { // Opera
		x = ev.offsetX;
		y = ev.offsetY;
	}
	return {
		x: x,
		y: y
	};
}

function sortBy(propertyName) {
	return function(object1, object2) {
		var value1 = object1[propertyName];
		var value2 = object2[propertyName];
		if (value2 < value1) {
			return -1;
		} else if (value2 > value1) {
			return 1;
		} else {
			return 0;
		}
	}
}

function NChart(context, type) {
	switch (type) {
		case 'pie':
			this.type = Pie;
			break;
		case 'bar':
			this.type = Bar;
			break;
		case 'radar':
			this.type = Radar;
			break;
		case 'ring':
			this.type = Pie;
			break;
		case 'line':
			this.type=Line;
			break;
	}
	return new this.type(context, type);
}
/**/
function Element(context) {
	this.context = context;
}
Element.prototype.config = function(options) {
	for (prop in options) {
		this[prop] = options[prop];
	}
	/*radar config*/
	if (this.data && this.index) {
		this.rad = 360 / this.index.length;
		var max = 0;
		this.max = 0;
		for (var i = 0; i < this.data.length; i++) {
			max = Math.max.apply(null, this.data[i]['value'])
			this.max = this.max > max ? this.max : max;
		}
		this.levels = 5;
		this.distance = 1;
		while (this.distance * this.levels < this.max) {
			this.distance = this.distance + 1;
		}
	}
	/* pie config*/
	if (this.data 
		&& !(Object.prototype.toString.call(this.data[0]['value']) == '[object Array]')
		&& !(Object.prototype.toString.call(this.data[0]['value']) == '[object Function]')) { 
		this.data = this.data.sort(sortBy('value'));
	}
	/*bar config*/
	if (this.data && this.data[0]['type']) {
		this.group = [];
		this.data.forEach(function(item) {
			if (!this[item['type']]) {
				this[item['type']] = item['value'];
				this.group[[item['type']]] = item['value'];
				this.group.length = this.group.length + 1;
			} else {
				this[item['type']] = this[item['type']].concat(item['value']);
				this.group[item['type']] = this[item['type']]
			}
		}.bind(this));

		this.max = 0;
		for (item in this.group) {
			var array = this.group[item]; //18
			var groupNumberNum = array.length / this.xAxis.length; //3
			var max = 0;
			for (var j = 0; j < this.xAxis.length; j++) {
				for (var i = 0; i < groupNumberNum; i++) {
					max = this.group[item][j + i * 6] + max; 
				}
				this.max = max > this.max ? max : this.max;
				max = 0;
			}
		}
		this.distance = 5;
		while (this.distance * 6 < this.max) {
			this.distance = this.distance + 5;
		}
	}
	/*line config*/
	if (this.data&&this.type=='line') {
		this.max = 0;		
		for (var i = 0; i < this.data.length; i++) {
			for(var j=0;j<this.data[i]['value'].length;j++){
				this.max =this.max > this.data[i]['value'][j] ? this.max : this.data[i]['value'][j];
			}
		}	
		this.distance = 5;
		while (this.distance * 6 < this.max) {
			this.distance = this.distance + 5;
		}
	}
	this.configMessage();
	return this;
}

function Pie(context, type) {
	//	console.log(type)
	this.type = type;
	Element.apply(this, [context])
	this.color = ['yellow', 'pink', 'blue', 'green', 'orange', 'black', 'red'];
	this.deg = [];
	this.value = [];
}
Pie.prototype = inherit(Element.prototype);
Pie.constructor = Pie;
Pie.prototype.addEvent = function(canvas, ctx) {
	var nowdeg = -Math.PI / 2;
	var circleCenter = this.circleCenter;
	var radius = this.radius;
	var display=document.createElement('div');
	display.style.padding="10px";
	display.style.color="white";
	display.style.backgroundColor="rgba(0,0,0,0.45)";
	display.style.display="none";
	document.body.appendChild(display);

	canvas.addEventListener('mousemove', function(event) {
		var pos = getEventPosition(event);
		var j;
		ctx.clearRect(0, 0, 9999, 9999);
		for (var i = 0; i <= this.deg.length - 1; i++) {
			ctx.strokeStyle = this.color[i]
			ctx.beginPath();
			ctx.moveTo(circleCenter, circleCenter)
			ctx.arc(circleCenter, circleCenter, radius, nowdeg, this.deg[i] + nowdeg);
			nowdeg = this.deg[i] + nowdeg;
			//ctx.stroke();
			ctx.globalAlpha = 0.4;
			ctx.fillStyle = this.color[i];
			ctx.fill()
			if (ctx.isPointInPath(pos.x, pos.y)) {
				ctx.clearRect(0, 0, 9999, 9999);
				j = i;
				nowdeg = -Math.PI / 2;
				for (var i = 0; i <= this.deg.length - 1; i++) {
					ctx.strokeStyle = this.color[i]
					ctx.beginPath();
					ctx.moveTo(circleCenter, circleCenter)
					if (i != j) {
						ctx.arc(circleCenter, circleCenter, radius, nowdeg, this.deg[i] + nowdeg);
					} else {
						ctx.arc(circleCenter, circleCenter, radius + 20, nowdeg, this.deg[i] + nowdeg);
					}
					nowdeg = this.deg[i] + nowdeg;
					ctx.fillStyle = this.color[i];
					ctx.globalAlpha = 0.4;
					ctx.fill()
				}
			}
			if (this.type == 'ring') {
				ctx.beginPath();
				ctx.arc(circleCenter, circleCenter, radius / 2.5, 0, Math.PI * 2);
				ctx.fillStyle = "white"
				ctx.globalAlpha = 1;
				ctx.fill();
			}

		}
		var distance2 = Math.pow(pos.x - circleCenter, 2) + Math.pow(pos.y - circleCenter, 2);
		if (this.message && distance2 < Math.pow(radius - 5, 2)) {
			//ctx.globalAlpha = 0.4;
			//ctx.fillStyle = 'black';
			//ctx.fillRect(pos.x + 20, pos.y + 20, circleCenter / 1.6, circleCenter / 2);
			//ctx.font = "15pt Calibri";
			//ctx.globalAlpha = 1;
			//ctx.fillStyle = 'white';
			for (var i = 0; i < this.mge.length; i++) {
				var name = this.mge[i].replace(/{{name}}/, this.data[j].name);
				display.style.display="block";
				display.style. position="absolute";
				display.style.left=event.clientX+20+"px";
				display.style.top=event.clientY+20+"px";
				/*
				if (!name.match('{{value}}')) {
					ctx.fillText(name, pos.x + 40, pos.y + 40 + (i) * 20);
				}
				*/
				var value = name.replace(/{{value}}/, this.data[j].value);
				/*
				if (!value.match('{{value}}') || !value.match('{{percent}}')) {
					ctx.fillText(value, pos.x + 40, pos.y + 40 + (i) * 20);
				}
				*/
				var message=this.message.replace(/{{name}}/, this.data[j].name).replace(/{{value}}/, this.data[j].value);
				display.innerHTML=message;
			}
		}
		else{
			display.style.display="none";
		}
		event.stopPropagation();
	}.bind(this));

	canvas.addEventListener('mouseout', function(event) {
		event.stopPropagation();
		var nowdeg = -Math.PI / 2;
		ctx.clearRect(0, 0, 9999, 9999);
		for (var i = 0; i <= this.deg.length - 1; i++) {
			ctx.fillStyle = this.color[i]
			ctx.strokeStyle = this.color[i]
			ctx.beginPath();
			ctx.moveTo(circleCenter, circleCenter)
			ctx.arc(circleCenter, circleCenter, radius, nowdeg, this.deg[i] + nowdeg);
			nowdeg = this.deg[i] + nowdeg;
			ctx.globalAlpha = 0.4;
			ctx.fill()
			if (this.type == 'ring') {
				ctx.beginPath();
				ctx.arc(circleCenter, circleCenter, radius / 2.5, 0, Math.PI * 2);
				ctx.fillStyle = "white"
				ctx.globalAlpha = 1;
				ctx.fill();
			}
		}
	}.bind(this))
}
Pie.prototype.draw = function() {
	var ctx = this.context;
	var canvas = ctx.canvas;
	var canvasHeight = canvas.offsetHeight;
	var canvasWidth = canvas.offsetWidth;
	var circleCenter = canvasWidth > canvasHeight ? canvasHeight / 2 : canvasWidth / 2;
	this.circleCenter = circleCenter;
	var radius = canvasHeight > canvasWidth ? (canvasWidth - 30) / 2 : (canvasHeight - 30) / 2;
	radius = radius - 30;
	this.radius = radius;
	this.value = this.data.map(function(data) {
		return data.value
	})
	var totalValue = this.value.reduce(function(x, y) {
		return x + y;
	})
	this.deg = this.value.map(function(x) {
		var rad = x * 360 / totalValue;
		return rad * Math.PI / 180;
	})
	this.percent = this.value.map(function(x) {
		return x / totalValue;
	})
	var nowdeg = -Math.PI / 2;
	ctx.clearRect(0, 0, 9999, 9999)
	for (var i = 0; i <= this.deg.length - 1; i++) {
		ctx.fillStyle = this.color[i]
		ctx.strokeStyle = this.color[i]
		ctx.beginPath();
		ctx.moveTo(circleCenter, circleCenter)
		ctx.arc(circleCenter, circleCenter, radius, nowdeg, this.deg[i] + nowdeg);
		nowdeg = this.deg[i] + nowdeg;
		//	ctx.stroke()
		ctx.globalAlpha = 0.4;
		ctx.fill()
		if (this.type == 'ring') {
			ctx.beginPath();
			ctx.arc(circleCenter, circleCenter, radius / 2.5, 0, Math.PI * 2);
			ctx.fillStyle = "white"
			ctx.globalAlpha = 1;
			ctx.fill();
		}
	}
	this.addEvent(canvas, ctx);
	return this;
};
Pie.prototype.configMessage=function () {
	if (this.message && this.data) { //message  config
		this.mge = [];
		this.message = this.message.replace(/ \s+/g, '')
		this.mge = this.message.split('/n');
	}
}



function Radar(context,type) {
	Element.apply(this, [context]);
	this.type=type;
	this.color = ['red', 'green', 'blue', 'black', 'orange', 'brown'];
	return this;
}
Radar.prototype = inherit(Element.prototype);
Radar.constructor = Radar;
Radar.prototype.draw = function() {
	var ctx = this.context;
	var canvas = ctx.canvas;
	var canvasHeight = canvas.offsetHeight;
	var canvasWidth = canvas.offsetWidth;
	var circleCenter = canvasWidth > canvasHeight ? canvasHeight / 2 : canvasWidth / 2;
	this.circleCenter = circleCenter;
	var radius = canvasHeight > canvasWidth ? (canvasWidth - 30) / 2 : (canvasHeight - 30) / 2;
	radius = radius - 30;
	this.radius = radius;
	//console.log(this.distance + "," + this.circleCenter + "," + this.rad)
	//console.log(-this.radius)
	ctx.clearRect(0, 0, 9999, 9999)
	ctx.translate(circleCenter, circleCenter);
	for (var j = this.levels; j > 0; j--) {
		var distance = this.radius * (5 * this.distance - (j - 1) * this.distance) / (5 * this.distance);
		//	console.log(5*this.distance-(j-1)*this.distance+","+distance+","+j)
		for (var i = 0; i < this.index.length; i++) {
			ctx.beginPath();
			ctx.globalAlpha = 0.4;
			ctx.rotate(this.rad * Math.PI / 180);
			ctx.moveTo(0, 0);
			ctx.lineTo(0, -distance);
			if (j != 1) {
				ctx.strokeStyle = "rgba(0,0,0,0)";
			} else {
				ctx.strokeStyle = "black";
			}
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(0, -distance);
			var x = distance * Math.sin(this.rad * Math.PI / 180);
			var y = distance * Math.cos(this.rad * Math.PI / 180);
			ctx.strokeStyle = "black"
			ctx.lineTo(x, 0 - y)
			ctx.stroke();
		}
	}

	ctx.translate(-circleCenter, -circleCenter);
	for (var i = 0; i < this.index.length; i++) {
		var rad = i * this.rad;
		var x = circleCenter + Math.sin(rad * Math.PI / 180) * (this.radius + 8);
		var y = circleCenter - Math.cos(rad * Math.PI / 180) * (this.radius + 8);
		//console.log(rad+","+x)
		if (rad == 0 || (rad > 84 && rad < 96)) {
			ctx.textAlign = "center"
		} else if (rad < 180) {
			ctx.textAlign = "left"
		} else {
			ctx.textAlign = "right"
		}
		ctx.fillStyle = "black"
		ctx.fillText(this.index[i], x, y)
	}
	for (var j = 0; j < this.data.length; j++) {
		ctx.beginPath();
		for (var i = 0; i < this.index.length; i++) {
			var value = this.data[j]['value'][i] * this.radius / (this.distance * 5);
			var rad = i * this.rad;
			var x = circleCenter + Math.sin(rad * Math.PI / 180) * (value);
			var y = circleCenter - Math.cos(rad * Math.PI / 180) * (value);
			//	console.log(distance);
			if (i == 0) {
				ctx.moveTo(x, y);
			} else ctx.lineTo(x, y);

		}
		ctx.closePath()
			//ctx.stroke()
		ctx.fillStyle = this.color[j];
		ctx.fill();
	}
	this.addEvent(canvas, ctx);
	return this;
}
Radar.prototype.addEvent = function(canvas, ctx) {
	var display=document.createElement('div');
	display.style.padding="10px";
	display.style.color="white";
	display.style.backgroundColor="rgba(0,0,0,0.45)";
	display.style.display="none";
	document.body.appendChild(display);

	canvas.addEventListener('mousemove', function(event) {
		ctx.clearRect(0, 0, 9999, 9999)
		var pos = getEventPosition(event);
		//console.log(pos.x)
		var points = [];
		var canvasHeight = canvas.offsetHeight;
		var canvasWidth = canvas.offsetWidth;
		var circleCenter = canvasWidth > canvasHeight ? canvasHeight / 2 : canvasWidth / 2;
		this.circleCenter = circleCenter;
		var radius = canvasHeight > canvasWidth ? (canvasWidth - 30) / 2 : (canvasHeight - 30) / 2;
		radius = radius - 30;
		this.radius = radius;
		//console.log(this.distance + "," + this.circleCenter + "," + this.rad)
		//console.log(-this.radius)
		ctx.translate(circleCenter, circleCenter);
		for (var j = this.levels; j > 0; j--) {
			var distance = this.radius * (5 * this.distance - (j - 1) * this.distance) / (5 * this.distance);
			for (var i = 0; i < this.index.length; i++) {
				ctx.beginPath();
				ctx.globalAlpha = 0.4;
				ctx.rotate(this.rad * Math.PI / 180);
				ctx.moveTo(0, 0);
				ctx.lineTo(0, -distance);
				if (j != 1) {
					ctx.strokeStyle = "rgba(0,0,0,0)";
				} else {
					ctx.strokeStyle = "black";
				}
				ctx.stroke();
				ctx.beginPath();
				ctx.moveTo(0, -distance);
				var x = distance * Math.sin(this.rad * Math.PI / 180);
				var y = distance * Math.cos(this.rad * Math.PI / 180);
				ctx.strokeStyle = "black"
				ctx.lineTo(x, 0 - y)
				ctx.stroke();
			}
		}
		/*darw text*/
		ctx.translate(-circleCenter, -circleCenter);
		for (var i = 0; i < this.index.length; i++) {
			var rad = i * this.rad;
			var x = circleCenter + Math.sin(rad * Math.PI / 180) * (this.radius + 8);
			var y = circleCenter - Math.cos(rad * Math.PI / 180) * (this.radius + 8);
			var xt = circleCenter + Math.sin(rad * Math.PI / 180) * (this.radius);
			var yt = circleCenter - Math.cos(rad * Math.PI / 180) * (this.radius);
			points.push({
				x: xt,
				y: yt
			});
			if (rad == 0 || (rad > 84 && rad < 96)) {
				ctx.textAlign = "center"
			} else if (rad < 180) {
				ctx.textAlign = "left"
			} else {
				ctx.textAlign = "right"
			}
			ctx.fillStyle = "black"
			ctx.fillText(this.index[i], x, y)
		}
		/*draw data*/
		for (var j = 0; j < this.data.length; j++) {
			ctx.beginPath();
			for (var i = 0; i < this.index.length; i++) {
				var value = this.data[j]['value'][i] * this.radius / (this.distance * 5);
				var rad = i * this.rad;
				var x = circleCenter + Math.sin(rad * Math.PI / 180) * (value);
				var y = circleCenter - Math.cos(rad * Math.PI / 180) * (value);
				//	console.log(distance);
				if (i == 0) {
					ctx.moveTo(x, y);
				} else {
					ctx.lineTo(x, y);
				}
			}
			ctx.closePath()
			ctx.fillStyle = this.color[j];
			ctx.fill();
		}

		var index = -1;
		var distance2 = points.map(function(point) {
			index++;
			return Math.pow(pos.x - point.x, 2) + Math.pow(pos.y - point.y, 2)
		})
		var mindiatnce = Math.min.apply(null, distance2);
		//console.log(mindiatnce)
		for (var i = 0; i < this.index.length; i++) {
			if (distance2[i] == mindiatnce) {
				//console.log(i);
				index = i;
				break;
			}
		}
		for (var i = 0; i < this.data.length; i++) {
			//console.log(this.data[i]['value'][index])
			var value = this.data[i]['value'][index] * this.radius / (this.distance * 5);
			var rad = index * this.rad;
			var x = circleCenter + Math.sin(rad * Math.PI / 180) * (value);
			var y = circleCenter - Math.cos(rad * Math.PI / 180) * (value);
			ctx.beginPath();
			ctx.arc(x, y, 5, 0, Math.PI * 2);
			ctx.globalAlpha = 0.7;
			ctx.fillStyle = this.color[i];
			ctx.fill();
		}
		/*display message*/

		display.style.display="block";
		display.style. position="absolute";
		display.style.left=event.clientX+20+"px";
		display.style.top=event.clientY+20+"px";
		var message=this.message.replace(/{{index}}/, this.index[index]);
		for(var i=0;i<this.data.length;i++){
			message=message.replace(/{{name}}/,this.data[i]['name']).replace(/{{value}}/,this.data[i]['value'][index]);
		}
		display.innerHTML=message;
	}.bind(this));

	canvas.addEventListener('mouseout', function() {
		var ctx = this.context;
		var canvas = ctx.canvas;
		var canvasHeight = canvas.offsetHeight;
		var canvasWidth = canvas.offsetWidth;
		var circleCenter = canvasWidth > canvasHeight ? canvasHeight / 2 : canvasWidth / 2;
		this.circleCenter = circleCenter;
		var radius = canvasHeight > canvasWidth ? (canvasWidth - 30) / 2 : (canvasHeight - 30) / 2;
		radius = radius - 30;
		this.radius = radius;
		//console.log(this.distance + "," + this.circleCenter + "," + this.rad)
		//console.log(-this.radius)
		ctx.clearRect(0, 0, 9999, 9999)
		ctx.translate(circleCenter, circleCenter);
		for (var j = this.levels; j > 0; j--) {
			var distance = this.radius * (5 * this.distance - (j - 1) * this.distance) / (5 * this.distance);
			//	console.log(5*this.distance-(j-1)*this.distance+","+distance+","+j)
			for (var i = 0; i < this.index.length; i++) {
				ctx.beginPath();
				ctx.globalAlpha = 0.4;
				ctx.rotate(this.rad * Math.PI / 180);
				ctx.moveTo(0, 0);
				ctx.lineTo(0, -distance);
				if (j != 1) {
					ctx.strokeStyle = "rgba(0,0,0,0)";
				} else {
					ctx.strokeStyle = "black";
				}
				ctx.stroke();
				ctx.beginPath();
				ctx.moveTo(0, -distance);
				var x = distance * Math.sin(this.rad * Math.PI / 180);
				var y = distance * Math.cos(this.rad * Math.PI / 180);
				ctx.strokeStyle = "black"
				ctx.lineTo(x, 0 - y)
				ctx.stroke();
			}
		}

		ctx.translate(-circleCenter, -circleCenter);
		for (var i = 0; i < this.index.length; i++) {
			var rad = i * this.rad;
			var x = circleCenter + Math.sin(rad * Math.PI / 180) * (this.radius + 8);
			var y = circleCenter - Math.cos(rad * Math.PI / 180) * (this.radius + 8);
			//console.log(rad+","+x)
			if (rad == 0 || (rad > 84 && rad < 96)) {
				ctx.textAlign = "center"
			} else if (rad < 180) {
				ctx.textAlign = "left"
			} else {
				ctx.textAlign = "right"
			}
			ctx.fillStyle = "black"
			ctx.fillText(this.index[i], x, y)
		}
		for (var j = 0; j < this.data.length; j++) {
			ctx.beginPath();
			for (var i = 0; i < this.index.length; i++) {
				var value = this.data[j]['value'][i] * this.radius / (this.distance * 5);
				var rad = i * this.rad;
				var x = circleCenter + Math.sin(rad * Math.PI / 180) * (value);
				var y = circleCenter - Math.cos(rad * Math.PI / 180) * (value);
				//	console.log(distance);
				if (i == 0) {
					ctx.moveTo(x, y);
				} else ctx.lineTo(x, y);

			}
			ctx.closePath()
			ctx.fillStyle = this.color[j];
			ctx.fill();
		}
		display.style.display="none";
	}.bind(this))
}
Radar.prototype.configMessage=function (argument) {
	var message=this.message
	for(var i=0;i<this.data.length-1;i++){
		this.message=this.message+"<br/>"+message;
	}
	this.message="{{index}}<br/>"+this.message;
}


function Bar(context,type) {
	this.type=type;
	Element.apply(this, [context])
	this.color = ['red', 'yellow', 'blue', 'green', 'orange', 'brown'];
	this.value = [];
};
Bar.prototype = inherit(Element.prototype);
Bar.constructor = Bar;
Bar.prototype.addEvent = function(canvas, ctx) {
	var display=document.createElement('div');
	display.style.padding="10px";
	display.style.color="white";
	display.style.backgroundColor="rgba(0,0,0,0.45)";
	display.style.display="none";
	document.body.appendChild(display);
	canvas.addEventListener('mousemove', function(event) {
		var pos = getEventPosition(event);
		ctx.clearRect(0, 0, 9999, 9999)
		var canvasHeight = canvas.offsetHeight;
		var canvasWidth = canvas.offsetWidth;
		ctx.strokeStyle = "black";
		ctx.globalAlpha = 0.6;
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(60, 10);
		ctx.lineTo(60, canvasHeight - 60);
		ctx.lineTo(canvasWidth - 10, canvasHeight - 60);
		ctx.stroke();
		var distanceY = (canvasHeight - 60 - 10) / 6;
		//	console.log(distance)
		/*draw yaxis*/

		var distance = (canvasWidth - 10 - 60) / this.xAxis.length;
		for (var i = 0; i < this.xAxis.length; i++) {
			ctx.globalAlpha = 0.3;
			ctx.beginPath();
			ctx.moveTo(60 + (i) * distance, canvasHeight - 60);
			ctx.lineTo(60 + (i) * distance, 10);
			ctx.lineTo(60 + (i + 1) * distance, 10);
			ctx.lineTo(60 + (i + 1) * distance, canvasHeight - 60);
			ctx.closePath();
			if (ctx.isPointInPath(pos.x, pos.y)) {
				var j = i
					//	console.log(pos.x + "," + pos.y)
				ctx.moveTo(60 + (j) * distance, canvasHeight - 60);
				ctx.lineTo(60 + (j) * distance, 10);
				ctx.lineTo(60 + (j + 1) * distance, 10);
				ctx.lineTo(60 + (j + 1) * distance, canvasHeight - 60);
				ctx.closePath();
				ctx.fillStyle = "black"
				ctx.fill();
				/*dispaly message*/
				display.style.display="block";
				display.style. position="absolute";
				display.style.left=event.clientX+20+"px";
				display.style.top=event.clientY+20+"px";
				var message=this.message.replace(/{{xAxis}}/,this.xAxis[j]);//.replace(/{{value}}/,this.data[j]);
				for(var x=0;x<this.data.length;x++){
					message=message.replace(/{{value}}/,this.data[x]['value'][j]);
				}

				display.innerHTML=message;
				break;
			}
			else {
				display.style.display="none";
			}
			ctx.fillStyle = "rgba(3,3,3,0)"
			ctx.fill();
		}

		for (var i = 0; i <= 6; i++) {
			ctx.globalAlpha = 1;
			ctx.beginPath();
			ctx.lineWidth = 0.5;
			ctx.moveTo(55, 10 + i * distanceY);
			ctx.textAlign = "right";
			var value = this.distance * (6 - i);
			ctx.fillStyle = "black";
			ctx.fillText(value + this.yAxis, 55, 15 + (i) * distanceY)
			ctx.lineTo(60, 10 + i * distanceY);
			ctx.strokeStyle = "black";
			ctx.stroke()
			ctx.globalAlpha = 0.2;
			ctx.lineTo(canvasWidth - 10, 10 + i * distanceY);
			ctx.strokeStyle = "black";
			ctx.stroke()
		}

		/*draw xaxis*/
		ctx.strokeStyle = "black";
		for (var i = 0; i < this.xAxis.length; i++) {
			ctx.globalAlpha = 1;
			ctx.beginPath();
			ctx.strokeStyle = "black"
			ctx.lineWidth = 0.5;
			ctx.moveTo(60 + (i + 1) * distance, canvasHeight - 55);
			ctx.textAlign = "center";
			var value = this.xAxis[i];
			ctx.fillText(value, 60 + (i + 1) * distance - distance / 2, canvasHeight - 40)
			ctx.lineTo(60 + (i + 1) * distance, canvasHeight - 60);
			ctx.stroke()
			ctx.globalAlpha = 0.2;
			ctx.lineTo(60 + (i + 1) * distance, 10);
			ctx.stroke()
		}


		/* draw bar */
		ctx.globalAlpha = 0.4;
		var barWidth = (distance - 16) / this.group.length;
		//console.log(barWidth)
		var barcount = 0;
		var colorcount = 0;
		for (var item in this.group) {
			//console.log(this.group[item])
			barcount++;
			var levels = this.group[item].length / this.xAxis.length;
			var times = this.xAxis.length
				//console.log(levels)
			for (var j = 0; j < times; j++) { //6
				ctx.strokeStyle = this.color[0];
				var nowHeight = canvasHeight - 60;
				//console.log(nowHeight+"!"+this.distance*6)
				for (var i = 0; i < levels; i++) { //3levels
					ctx.beginPath();
					ctx.lineWidth = 1;
					ctx.moveTo(60 + 8 + j * distance + barWidth * (barcount - 1), nowHeight);
					ctx.lineTo(60 + 8 + j * distance + barWidth * barcount, nowHeight);
					var ratio = (canvasHeight - 70) / (this.distance * 6);
					var thisHeight = this.group[item][j + i * 6] * ratio;
					//console.log(this.group[item][j+i*this.xAxis.length]+","+thisHeight)
					ctx.lineTo(60 + 8 + (j) * distance + barWidth * barcount, nowHeight - thisHeight)
					ctx.lineTo(60 + 8 + j * distance + barWidth * (barcount - 1), nowHeight - thisHeight)
					nowHeight = nowHeight - thisHeight;
					ctx.closePath()
					ctx.stroke();
					ctx.fillStyle = this.color[i];
					ctx.fill();
				}
			}
		}

	}.bind(this))
}
Bar.prototype.draw = function() {
	var ctx = this.context;
	var canvas = ctx.canvas;
	var canvasHeight = canvas.offsetHeight;
	var canvasWidth = canvas.offsetWidth;
	ctx.strokeStyle = "black";
	ctx.globalAlpha = 0.6;
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(60, 10);
	ctx.lineTo(60, canvasHeight - 60);
	ctx.lineTo(canvasWidth - 10, canvasHeight - 60);
	ctx.stroke();
	var distance = (canvasHeight - 60 - 10) / 6;
	//	console.log(distance)
	/*draw yaxis*/
	for (var i = 0; i <= 6; i++) {
		ctx.globalAlpha = 1;
		ctx.beginPath();
		ctx.lineWidth = 0.5;
		ctx.moveTo(55, 10 + i * distance);
		ctx.textAlign = "right";
		var value = this.distance * (6 - i);
		ctx.fillText(value + this.yAxis, 55, 15 + (i) * distance)
		ctx.lineTo(60, 10 + i * distance);
		ctx.stroke()
		ctx.globalAlpha = 0.2;
		ctx.lineTo(canvasWidth - 10, 10 + i * distance);
		ctx.stroke()
	}
	distance = (canvasWidth - 10 - 60) / this.xAxis.length;
	//	console.log(distance)
	/*draw xaxis*/
	for (var i = 0; i < this.xAxis.length; i++) {
		ctx.globalAlpha = 1;
		ctx.beginPath();
		ctx.lineWidth = 0.5;
		ctx.moveTo(60 + (i + 1) * distance, canvasHeight - 55);
		ctx.textAlign = "center";
		var value = this.xAxis[i];
		ctx.fillText(value, 60 + (i + 1) * distance - distance / 2, canvasHeight - 40)
		ctx.lineTo(60 + (i + 1) * distance, canvasHeight - 60);
		ctx.stroke()
		ctx.globalAlpha = 0.2;
		ctx.lineTo(60 + (i + 1) * distance, 10);
		ctx.stroke()
	}

	/* draw bar */
	ctx.globalAlpha = 0.4;
	var barWidth = (distance - 16) / this.group.length;
	//console.log(barWidth)
	var barcount = 0;
	var colorcount = 0;
	for (var item in this.group) {
		//console.log(this.group[item])
		barcount++;
		var levels = this.group[item].length / this.xAxis.length;
		var times = this.xAxis.length
			//console.log(levels)
		for (var j = 0; j < times; j++) { //6
			ctx.strokeStyle = this.color[0];
			var nowHeight = canvasHeight - 60;
			//console.log(nowHeight+"!"+this.distance*6)
			for (var i = 0; i < levels; i++) { //3levels
				ctx.beginPath();
				ctx.lineWidth = 1;
				ctx.moveTo(60 + 8 + j * distance + barWidth * (barcount - 1), nowHeight);
				ctx.lineTo(60 + 8 + j * distance + barWidth * barcount, nowHeight);
				var ratio = (canvasHeight - 70) / (this.distance * 6);
				var thisHeight = this.group[item][j + i * 6] * ratio;
				//console.log(this.group[item][j+i*this.xAxis.length]+","+thisHeight)
				ctx.lineTo(60 + 8 + (j) * distance + barWidth * barcount, nowHeight - thisHeight)
				ctx.lineTo(60 + 8 + j * distance + barWidth * (barcount - 1), nowHeight - thisHeight)
				nowHeight = nowHeight - thisHeight;
				ctx.closePath()
				ctx.stroke();
				ctx.fillStyle = this.color[i];
				ctx.fill();
			}
		}
	}
	this.addEvent(canvas, ctx);
	return this;
}
Bar.prototype.configMessage=function (argument) {
	var message=this.message;
	var typeNum=0;
	var type=[];
	this.data=this.data.sort(sortBy('type'));
	for(var i=0;i<this.data.length-1;i++){
		if (this.data[i+1]['type']==this.data[i]['type']) {
			this.message=this.message+"<br/>"+message;
		}
		else{
			type[typeNum++]=this.data[i]['type'];
			this.message=this.message+"<br/>{{type}}<br/>"+message;
		}
	}
	type[typeNum++]=this.data[this.data.length-1]['type'];
	for(var i=0;i<this.data.length;i++){
		this.message=this.message.replace(/{{name}}/,this.data[i]['name']);//;.replace(/{{value}}/,this.data[i]['value']);
	}
	this.message="{{xAxis}}<br/>"+"{{type}}<br/>"+this.message;
	for(var i=0;i<typeNum;i++){
		this.message=this.message.replace(/{{type}}/,type[i]);
	}
	console.log(type)
}



function Line(context,type) {
	this.type=type;
	Element.apply(this, [context]);
	this.color = ['red', 'green', 'blue', 'black', 'orange', 'brown'];
	return this;
}
Line.prototype = inherit(Element.prototype);
Line.constructor = Line;
Line.prototype.draw=function () {
	var ctx = this.context;
	var canvas = ctx.canvas;
	var canvasHeight = canvas.offsetHeight;
	var canvasWidth = canvas.offsetWidth;
	ctx.strokeStyle = "black";
	ctx.globalAlpha = 0.6;
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(60, 10);
	ctx.lineTo(60, canvasHeight - 60);
	ctx.lineTo(canvasWidth - 10, canvasHeight - 60);
	ctx.stroke();
	var distance = (canvasHeight - 60 - 10) / 6;
	/*draw yaxis*/
	for (var i = 0; i <= 6; i++) {
		ctx.globalAlpha = 1;
		ctx.beginPath();
		ctx.lineWidth = 0.5;
		ctx.moveTo(55, 10 + i * distance);
		ctx.textAlign = "right";
		var value = this.distance * (6 - i);
		ctx.fillText(value + this.yAxis, 55, 15 + (i) * distance)
		ctx.lineTo(60, 10 + i * distance);
		ctx.stroke()
		ctx.globalAlpha = 0.2;
		ctx.lineTo(canvasWidth - 10, 10 + i * distance);
		ctx.stroke()
	}
	distance = (canvasWidth - 10 - 60) / this.xAxis.length;
	/*draw xaxis*/
	for (var i = 0; i < this.xAxis.length; i++) {
		ctx.globalAlpha = 1;
		ctx.beginPath();
		ctx.lineWidth = 0.5;
		ctx.moveTo(60 + (i + 1) * distance, canvasHeight - 55);
		ctx.textAlign = "center";
		var value = this.xAxis[i];
		ctx.fillText(value, 60 + (i +1) * distance , canvasHeight - 40)
		ctx.lineTo(60 + (i + 1) * distance, canvasHeight - 60);
		ctx.stroke()
		ctx.globalAlpha = 0.2;
		ctx.lineTo(60 + (i + 1) * distance, 10);
		ctx.stroke()
	}
	ctx.globalAlpha=0.75;
	for(var i=0;i<this.data.length;i++){
		if (this.data[i]['curve']) {
			for(var j=0;j<this.data[i]['value'].length;j++){
				ctx.beginPath();
				var map=(canvasHeight-70)*this.data[i]['value'][j]/this.max;
				map=canvasHeight-60-map;
				var nextMap=(canvasHeight-70)*this.data[i]['value'][j+1]/this.max;
				nextMap=canvasHeight-60-nextMap;
				ctx.moveTo(60 + (j +1) * distance,map);
				ctx.bezierCurveTo(60 + (j +1) * distance+16,map,60+(j+2)*distance-16,nextMap,60+(j+2)*distance,nextMap);
				ctx.strokeStyle=this.color[i];
				ctx.stroke();
				ctx.beginPath();
				ctx.arc(60 + (j +1) * distance,map, 3 ,0, 2*Math.PI);
				ctx.stroke()
			}
		}
		else{
			for(var j=0;j<this.data[i]['value'].length;j++){
				ctx.beginPath();
				var map=(canvasHeight-70)*this.data[i]['value'][j]/this.max;
				map=canvasHeight-60-map;
				var nextMap=(canvasHeight-70)*this.data[i]['value'][j+1]/this.max;
				nextMap=canvasHeight-60-nextMap;
				ctx.moveTo(60 + (j +1) * distance,map);
				ctx.lineTo(60+(j+2)*distance,nextMap);
				ctx.strokeStyle=this.color[i];
				ctx.stroke();
				ctx.beginPath();
				ctx.arc(60 + (j +1) * distance,map, 3 ,0, 2*Math.PI);
				ctx.stroke()
			}
		}
	}
}
Line.prototype.configMessage=function (argument) {
	// body...
}