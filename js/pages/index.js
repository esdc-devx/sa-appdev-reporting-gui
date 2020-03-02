var ReadyPageIndex = function() {

    return {
        init: function() {

			// --- eChart -----------------------------------------------------
			
			// based on prepared DOM, initialize echarts instance
			var eChart = echarts.init(document.getElementById('cpChart'));

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
					name: 'Number of Cards',
					nameLocation : 'middle',
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

			// ----------------------------------------------------------------
		
			getReportData();

			$(window).on('resize', function () {
				if (eChart != null && eChart != undefined) {
					eChart.resize();
				}
			});

			$("#btnRefresh").click(function(){
				getReportData();
			});
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
	var eChart = echarts.init(document.getElementById('cpChart'));

	var loadingOptions = {
		color: '#666666',
		text: 'loading...'
	}

	$("#btnExportExcel").attr("disabled", true);
	$("#btnRefresh").attr("disabled", true);

	eChart.showLoading(loadingOptions);

	$("#cpDataTable").hide();

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
	var eChart = echarts.init(document.getElementById('cpChart'));
	
	eChartZeroToNull(data.compiledResults);

	eChart.hideLoading();

	eChart.setOption({
		dataset: {
			source: data.compiledResults
		}
	});

	if ($.fn.dataTable.isDataTable('#cpDataTable')) {
		var table = $('#cpDataTable').DataTable();
	}
	else {
		var table = $('#cpDataTable').DataTable(
			{
				data: data.reportItemResults,
				autoWidth: false,
				pageLength: 10,
				lengthMenu: [[5, 10, 20], [5, 10, 20]],
				columns: [
					{
						data: "taskName",
						render: function (data, type, row, meta) {
							if (type === 'display') {
								data = '<a href="' + row.url + '" target="_blank">' + data + '</a>';
							}

							return data;
						}
					},
					{
						data: "clientName"
					},
					{
						data: "statusTitle"
					},
					{
						data: "dateStarted"
					},
					{
						data: "dateCompleted"
					},
					{
						data: "assignedTo"
					}
				],
				order: [[1, 'asc'], [2, 'asc'], [0, 'asc']],
				dom: 'Bfrtip',
				buttons: [{ extend: 'excelHtml5', text: 'Export to Excel' }]
			}
		);
	}

	$("#btnExportExcel").click(function () {
		var table = $('#cpDataTable').DataTable();

		table.buttons(0, 0).trigger();
	});

	table.buttons().container().hide();

	$("#cpDataTable").show();

	$("#btnExportExcel").attr("disabled", false);
	$("#btnRefresh").attr("disabled", false);
}