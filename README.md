# wtinyChart.js
#JavaScript图表库

######=_=

###Bar
![](https://github.com/wonggigi/wtinyChart.js/blob/master/img/bar.png)

<pre><code>
`<!DOCTYPE html>
<html>
	<head>	
		
		<script src="wtinychartunmin.js"></script>
	</head>
	<body>
		<canvas id="bar" width="550" height="400"></canvas>
	</body>
	<script type="text/javascript">
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
	</script>
</html>	`
</code></pre>

###Pie
![](https://github.com/wonggigi/wtinyChart.js/blob/master/img/pie.png)

<pre><code>
var options={
	data:[
		{value:10,name:'wzz'},
		{value:30,name:'lrzx'},
		{value:20,name:'fw'},
		{value:80,name:'ss'},
		{value:100,name:'wzddz'}
	],
	message:"name:{{name}} <br/> is   <br/>value:{{value}}",
	title:"Pie Example"
}
var canvas=document.getElementById('pie');
var ctx=canvas.getContext('2d');
wtChart.init(ctx,'pie').config(options).draw();
</code></pre>

###Doughnut
![](https://github.com/wonggigi/wtinyChart.js/blob/master/img/ring.png)

<pre><code>
var options={
	data:[
		{value:10,name:'wzz'},
		{value:30,name:'lrzx'},
		{value:20,name:'fw'},
		{value:80,name:'xs'},
		{value:80,name:'ss'},
		{value:80,name:'ss'},
		{value:100,name:'wzddz'}
	],
	message:"name:{{name}} <br/>  is  <br/>value:{{value}}",
	title:"Ring Example"
}
var canvas=document.getElementById('ring');
var ctx=canvas.getContext('2d');
wtChart.init(ctx,'ring').config(options).draw();
</code></pre>

###Radar
![](https://github.com/wonggigi/wtinyChart.js/blob/master/img/radar.png)

<pre><code>
var options={
 	index:['javascript','css','html','python','nodejs','css3','html5'],
	data:[
		{value:[100,30,20,45,19,34,78],name:'lxc'},
		{value:[88,23,87,33,100,23,56],name:'wzz'},
		{value:[12,94,56,78,23,86,90],name:'wz'},
		{value:[84,70,80,75,80,60,70],name:'zjl'}
	],
	message:"name:{{name}}  value:{{value}} ",
	title:"Radar Example"
}`
var canvas=document.getElementById('radar');
var ctx=canvas.getContext('2d');
wtChart.init(ctx,'radar').config(options).draw();
</code></pre>

###Line
![](https://github.com/wonggigi/wtinyChart.js/blob/master/img/line.png)

<pre><code>
var canvas=document.getElementById('line');
var ctx=canvas.getContext('2d');
var options={
	data:[
		{value:[243,13,564,134,97,139,233,47,88,43,197,245,841,32,775,123,666,235],name:'wzz',curve:false},
		{value:[23,143,56,14,917,19,23,474,418,430,97,245,84,302,75,12,61,500],name:'lxc',curve:true},
	],	
	xAxis:["1m","2m","3m","4m","5m","6m","7m","8m","9m","10m","11m","12m","13m","14m","15m","16m","17m","18m"],
	yAxis:"HP",
	message:"name:{{name}}  value:{{value}}",
	title:"Line Example"
}
var canvas=document.getElementById('line');
var ctx=canvas.getContext('2d');
wtChart.init(ctx,'line').config(options).draw();
</code></pre>
