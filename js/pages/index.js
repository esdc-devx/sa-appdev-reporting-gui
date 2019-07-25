var ReadyPageIndex = function() {

    return {
        init: function() {

			// --- eChart -----------------------------------------------------

			// based on prepared DOM, initialize echarts instance
			var eChart = echarts.init(document.getElementById('echart'));

			var loadingOptions = {
				color: '#666666', 
				text: 'loading...'
			}

			eChart.showLoading(loadingOptions);

			// specify chart configuration item and data
			var eChartOption = {
				title: {
					show: false,
					text: 'Trello Cards Summary'
				},
				tooltip : {
					trigger: 'axis',
					axisPointer: {
						type: 'shadow',
						label: {
							show: false
						}
					}
				},
				legend: {
					type: 'plain',
					orient: 'horizontal'
				},
				toolbox: {
					show : false,
					showTitle : true,
					feature : {
						mark : {show: false},
						dataView : {show: false, readOnly: false},
						magicType: {show: false, type: ['line', 'bar']},
						restore : {show: false},
						saveAsImage : {show: false}
					}
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				xAxis:  {
					type: 'value',
					name: 'Nbr of Cards',
					nameLocation : 'center',
					nameGap: 25
				},
				yAxis: {
					type : 'category',
					name : 'Client',
					nameLocation : 'start',
					nameGap : 5,
					offset : 15,
					inverse: true
				},
				series: [
					{
						name: 'Backlog',
						type: 'bar',
						stack: '1',
						label: {
							normal: {
								show: true,
								position: 'inside'
							}
						},
						color: '#a15757'
					},
					{
						name: 'Committed',
						type: 'bar',
						stack: '1',
						label: {
							normal: {
								show: true,
								position: 'inside'
							}
						},
						color: '#d19b77'
					},
					{
						name: 'In Progress',
						type: 'bar',
						stack: '1',
						label: {
							normal: {
								show: true,
								position: 'inside'
							}
						},
						color: '#e0c88d'
					},
					{
						name: 'Blocked / On hold',
						type: 'bar',
						stack: '1',
						label: {
							normal: {
								show: true,
								position: 'inside'
							}
						},
						color: '#b7c199'
					},
					{
						name: 'Done',
						type: 'bar',
						stack: '1',
						label: {
							normal: {
								show: true,
								position: 'inside'
							}
						},
						color: '#7da381'
					}
				]
			};

			eChart.setOption(eChartOption);
			
			$(window).on('resize', function(){
				if(eChart != null && eChart != undefined){
					eChart.resize();
				}
			});

			getReportData();


			$("#btnRefresh").click(function(){
				eChart.showLoading(loadingOptions);

				getReportData();
			});

			// ----------------------------------------------------------------
        }
    };
}();

// zero values display on the chart... they state to use null if you don't want zero to display.
function eChartZeroToNull(arr){
	for(var i = 0; i < arr.length; i++){
		if(arr[i] instanceof Array){
			eChartZeroToNull(arr[i]);
		}
		else{
			if (arr[i] === "0"){
				arr[i] = "null";
			}
		}
	};
}

function getReportData(){
	var url = 'https://esdc-sa-appdev-reporting-func.azurewebsites.net/api/getSummaryReportResults?code=mGYkdKOuxTCPlaQia2LJBiclxohTGQ/09cH/ulwmKPk/f9vzJA/XMg==';

	$.ajax({
		type: "GET",
		url: url,
		dataType: "json",
		processData: true,
		data: {},
		success: function(data){
			processReportData(data);
		}
	});
}

function processReportData(data){
	var eChart = echarts.init(document.getElementById('echart'));

	eChartZeroToNull(data);

	eChart.hideLoading();

	eChart.setOption({
		dataset: {
			source: data
		}
	});
}