# wtinyChart.js
#JavaScript图表库

######=_=

###Pie
![](https://github.com/wonggigi/wtinyChart.js/blob/master/img/pie.png)

<pre><code>
var canvas=document.getElementById('canvas');
var ctx=canvas.getContext('2d');
var options={
	data:[
		{value:55,name:'January'},
		{value:60,name:'February'},
		{value:20,name:'March'},
		{value:80,name:'April'},
		{value:100,name:'May'}
		],
	message:"{{name}}<br/> weight:{{value}}kg",
	title:"Pie Example"
}
var wtc=wtChart.init(ctx,'pie').config(options).draw();
</code></pre>

###Doughnut
![](https://github.com/wonggigi/wtinyChart.js/blob/master/img/ring.png)

<pre><code>
var canvas=document.getElementById('canvas');
var ctx=canvas.getContext('2d');
var options={
	data:[
		{value:55,name:'January'},
		{value:60,name:'February'},
		{value:20,name:'March'},
		{value:80,name:'April'},
		{value:14,name:'May'},
		{value:100,name:'June'}
		],
	message:"Month:{{name}} <br/>height:{{value}}cm",
	title:"Ring Example"
}
var wtc=wtChart.init(ctx,'ring').config(options).draw();
</code></pre>

###Radar
![](https://github.com/wonggigi/wtinyChart.js/blob/master/img/radar.png)

<pre><code>
var options={
	index:['Javascript','CSS','HTML','Python','C++','PHP','Java'],
	data:[
		{value:[100,30,20,45,19,34,78],name:'Michaela'},
		{value:[88,53,87,33,100,23,56],name:'Wong'},
		{value:[12,94,56,78,23,86,90],name:'Jack'}
		],
	message:"name:{{name}}  value:{{value}} ",
	title:"Radar Example"
}
var canvas=document.getElementById('radar');
var ctx=canvas.getContext('2d');
var wtc=wtChart.init(ctx,'radar').config(options).draw();
</code></pre>

###Line
![](https://github.com/wonggigi/wtinyChart.js/blob/master/img/line.png)

<pre><code>
var options={
	data:[
		{value:[243,13,564,134,97,139,233,47,88,43,197,245,841,32,775,123,666,235],name:'Jack',curve:false},
		{value:[23,143,56,14,917,19,23,474,418,430,97,245,84,302,75,12,61,500],name:'Nick',curve:true},
	],	
	xAxis:["13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00","0:00","1:00","2:00","3:00","4:00","5:00","6:00"],
	yAxis:" m/s",
	message:"name:{{name}}  value:{{value}}",
	title:"Line Example"
}
var canvas=document.getElementById('line');
var ctx=canvas.getContext('2d');
var wtc=wtChart.init(ctx,'line').config(options).draw();
</code></pre>

###Bar 
![](https://github.com/wonggigi/wtinyChart.js/blob/master/img/bar2.png)

<pre><code>
var canvas=document.getElementById('bar');
		var ctx=canvas.getContext('2d');
	 	var options={
			data:[
				{type:'speed',value:[43,45,87,252,28,90],name:'wong'},
			],
			xAxis:["100m","200m","300m","400m","500m","600m"],
			yAxis:'m/s',
			message:"name:{{name}}   speed:{{value}}m/s",
			title:"Bar Example"
		}
		var wtc= wtChart.init(ctx,'bar').config(options).draw();
</code></pre>

###Bar Stack
![](https://github.com/wonggigi/wtinyChart.js/blob/master/img/bar.png)

<pre><code>
var canvas=document.getElementById('bar');
var ctx=canvas.getContext('2d');
var options={
	data:[
		{type:'eat',value:[43,45,87,252,28,90],name:'Wong-eat'},
		{type:'drink',value:[55,23,21,45,64,23],name:'Wong-drink'},
		{type:'buy',value:[110,292,231,78,329,200],name:'Wong-buy'},
		{type:'eat',value:[80,62,23,30,41,32],name:'Nick-eat'},
		{type:'eat',value:[120,32,43,80,51,82],name:'Amy-eat'},
		{type:'eat',value:[99,13,78,55,59,20],name:'Sheldon-eat'},
		{type:'drink',value:[219,44,22,55,77,98],name:'Leonard-drink'},
		{type:'buy',value:[11,92,231,78,39,20],name:'Amy-buy'}
	],
	xAxis:["January","February","March","April ","May","June"],
	yAxis:'T',
	message:"name:{{name}}  is  value:{{value}}",
	title:"Bar Example"
}
var wtc= wtChart.init(ctx,'bar').config(options).draw();
</code></pre>
