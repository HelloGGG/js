$(function(){
	var ue = UE.getEditor('discuss');

	$.ajax({
		url:'titleComplete.php',
		type:'POST',
		success:function(responseText,statusText){
			var json = $.parseJSON(responseText);
			var sources = [];
			var i = 0;
			$.each(json,function(index,value){
				 sources[index] = value['title']; 				//[{},{},{},{}...]提取数组中的对象的title值组成数据源
			});
			
			$('.header_search input').autocomplete({			//自动补全功能
				source:sources,
				minLength:1,
			});
		},
	});
	
	//邮箱自动补充
	$('#email').autocomplete({
		source:function(request,response){
			var hosts = ['qq.com','sina.com','gmail.com','163.com','sohu.com'],
				findedHosts = [],
				str = request.term,
				name = str,
				host = '',
				index = str.indexOf('@'),
				result = [];
			if(index > -1){
				name = str.slice(0,index);
				host = str.slice(index + 1);
			}
			if(host){
				findedHosts = $.grep(hosts,function(value,index){
					return value.indexOf(host) > -1;
				});
			}else{
				findedHosts = hosts;
			}
			result = $.map(findedHosts,function(value,index){
				return name + '@' + value;
			});
			response(result);
		},
		delay: 0
	});
	
	//设置搜索按钮效果
	$('#search_button').button({
		icons:{
			primary:'ui-icon-search'
		},
	});
	//设置表单按钮效果
	$('.reg p input[name=sex]').button();
	//设置表单日历
	$('#birth').datepicker({
		dateFormat:'yy-mm-dd',
		dayNamesMin:['日','一','二','三','四','五','六'],					//设置星期的最短格式
		monthNamesShort:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'], //快速选择月份有用
		monthNames:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],		//设置月份格式
		firstDay: 1,														//第一天为周一
		showOtherMonths:true,
		changeYear:true,
		prevText:'上月',
		nextText:'下月',
		maxDate: 0,							//可选的最大日期,0表示当天
		yearRange:'1920:2020', 				//年份的限制优先级小于日期,也就说最大能选到当前年份

	});										//$对象.datepicker({})初始化     $对象.datepicker('getDate'[,''])获取或设置


	$('#user_a,#logout_a').hide();
	if($.cookie().user){
		$('#user_a,#logout_a').show();
		$('#login_a,#reg_a').hide();
		$('#user_a').html($.cookie('user'));
	}else{
		$('#user_a,#logout_a').hide();
		$('#login_a,#reg_a').show();
	}
	$('#logout_a').click(function(){
		$.removeCookie('user');
		window.location.href = '/知乎前端/';
	});
	// 加载对话框
	$('#loading').dialog({
		 autoOpen:false,							//关闭自动打开
		 width:200,
		 height:50,
		 resizable:false,
		 draggable:false,
		 modal:true,
	}).parent().parent().find('.ui-widget-header').hide();
	// 登录对话框
	$('#login').dialog({
		autoOpen:false,
		title:'会员登录',			//设置标题
		buttons:{					//设置按钮
			'登录':function(){
				$(this).submit();
			},
			'取消':function(){
				$(this).dialog('close');
			}
		},
		show:'blind',					//显示效果		true为浅入浅出,默认为false为没有效果
		hide:'slide',                  //隐藏效果
		width:400,					//默认宽度,默认单位px
		height:350,
		draggable:false,     		//可拖拽
		resizable:false,             //可调整大小
		modal:true,				//默认为false,true对话框外不可操作
		closeText:'关闭'			//设置关闭按钮的title文字
	});

	//注册对话框
	$('#reg').dialog({
				autoOpen:false,
				title:'会员注册',			//设置标题
				buttons:{					//设置按钮
					'注册':function(){
							$(this).submit();
					},
					'取消':function(){
						$(this).dialog('close');
					}
				},
				show:false,					//显示效果		true为浅入浅出,默认为false为没有效果
				hide:false,                  //隐藏效果
				width:400,					//默认宽度
				height:500,
				draggable:true,     		//可拖拽
				resizable:true,             //可调整大小
				modal:true,				//默认为false,true对话框外不可操作
				closeText:'关闭'			//设置关闭按钮的title文字
	});

	//提问对话框
	 $('#question').dialog({
		autoOpen:false,
		title:'提问',
		buttons:{
			'确定':function(){
				$(this).submit();
			},
			'取消':function(){
				$(this).dialog('close');
			},
		},
		show:'slideDown',
		hide:'slideUp',
		width:530,
		height:462,
		resizable:false,
		draggable:true,
	}).validate({
		ignore: "",					//全部验证  默认为ignore:":hidden",忽略对隐藏元素的验证
		rules:{
			title:{
				required:true,
				rangelength:[5,50],
			},
			discuss:{
				required:true,
			},
		},
		messages:{
			title:{
				required:'问题标题不得为空',
				rangelength:'问题标题必须大于{0}小于{1}字符',
			},
			discuss:{
				required:'问题内容不得为空',
			}
		},
		errorLabelContainer:'.question_error',
		wrapper:'li',
		showErrors:function(errorMap,errorList){
			var errors = this.numberOfInvalids();
			if(errors > 0){
		 			$('#question').dialog('option','height',25 * errors + 500);
		 		}else{
		 			$('#question').dialog('option','height',500);
		 		}
		 	this.defaultShowErrors();
		},
		submitHandler:function(form){
			$(form).ajaxSubmit({
				url:'question.php',
				type:'POST',
				data:{
					user:$.cookie('user'),
					content: ue.getContent(),
				},
				beforeSubmit:function(responseText,statusText){
					$('#question').dialog('widget').find('button').eq(1).button('disable');
				},
				success:function(responseText,statusText){
					setTimeout(function(){
						alert(responseText);
						$('#question').dialog('close');
						$('#question').dialog('widget').find('button').eq(1).button('enable');
					}, 2000);
				},
			});
		},

	});

	$('#login_a').click(function(){
		$('#login').dialog('open').validate({
			rules:{
				user:{
					required:true,
					rangelength:[2,15],
				},
				pass:{
					required:true,
					rangelength:[4,15],
				}
			},
			messages:{
				user:{
					required:'请输入账号',
					rangelength:'非法账号',
				},
				pass:{
					required:'请输入密码',
					rangelength:'非法格式',
				}	
			},
			unhighlight:function(element,errorClass){
				$(element).css('border','1px solid #666');
				$(element).parent().find('span').html('&nbsp;&nbsp;&nbsp;').removeClass('star').addClass('success');
			},
			highlight:function(element,errorClass){
				$(element).css('border','1px solid red');
				$(element).parent().find('span').html('*').removeClass('success').addClass('star');
			},
			errorLabelContainer:'.login_error',							//设置统一放置错误提示的容器
		 	wrapper:'li',												//用li标签包装错误提示
		 	ignoreTitle:true,
			showErrors:function(errorMap,errorList){
				var errors = this.numberOfInvalids();						//对话框中错误数量
		 		if(errors > 0){
		 			$('#login').dialog('option','height',25 * errors + 350);
		 		}else{
		 			$('#login').dialog('option','height',350);
		 		}
		 		this.defaultShowErrors();
			},
			submitHandler:function(form){
				$(form).ajaxSubmit({
					url:'logincheck.php',
					type:'POST',
					beforeSubmit:function(){
						$('#login').dialog('widget').find('button').eq(1).button('disable');
					},
					success:function(responseText,statusText){
						if(responseText.slice(0,4) === 'true'){
							setTimeout(function(){
								alert('登陆成功');
								$('#login').dialog('widget').find('button').eq(1).button('enable');
								$('#login').dialog('close');
								if($('#login_cookie').is(':checked')){
									$.cookie('user',responseText.slice(4),{
										expires:7
									});
								}else{
									$.cookie('user',responseText.slice(4));
								}
								$('#user_a,#logout_a').show();
								$('#login_a,#reg_a').hide();
								$('#user_a').html($.cookie('user'));
							},1000);
						}else{
							setTimeout(function(){
								alert('密码错误');
								$('#login').dialog('widget').find('button').eq(1).button('enable');
								$('#login').dialog('close');
							},1000);
						}
						
					},
				});
			}
		});
	});

	

	
	$('#reg_a').click(function(){
		$('#reg').dialog('open').validate({
		 	showErrors:function(errorMap,errorList){						//显示错误方法
		 		var errors = this.numberOfInvalids();						//对话框中错误数量
		 		if(errors > 0){
		 			$('#reg').dialog('option','height',20 * errors + 500);
		 		}else{
		 			$('#reg').dialog('option','height',500);
		 		}
		 		this.defaultShowErrors();
		 	},
		 	highlight:function(element,errorClass){					//错误时高亮,一般设置文本边框css
		 		$(element).css('border','1px solid #2e82ff');
		 		$(element).parent().find('span').html('&nbsp;&nbsp;&nbsp;').removeClass('success');
		 	},
		 	unhighlight:function(element,errorClass){				//正确时不高亮
		 		$(element).css('border','1px solid #ccc');
		 		$(element).parent().find('span').html('&nbsp;&nbsp;&nbsp;').removeClass('star').addClass('success');
		 	},
		 	errorLabelContainer:'.reg_error',
		 	wrapper:'li',
			rules:{										//规则
				user:{
					required:true,
					rangelength:[2,15],
					remote:{						//AJax验证,远程验证
						url:'regcheck.php',
						type:'POST',

					}
				},
				pass:{
					required:true,
					rangelength:[4,15],
				},
				email:{
					required:true,
					email:true,
				},
			},
			messages:{					//信息
				user:{
					required:'用户名不得为空',
					rangelength:'用户名必须{0}-{1}字符',
					remote:'账号已存在',						//当php文件返回过来的是false,则打印错误信息
				},
				pass:{
					required:'密码不得为空',
					rangelength:'密码必须{0}-{1}字符',
				},
				email:{
					required:'邮箱不得为空',
					email:'非法邮箱',
				}
			},
			focusInvalid:true,					//默认是true,焦点定位到错误处 
			submitHandler:function(form){			//验证通过不会提交表单,可以作为测试用
				$(form).ajaxSubmit({
					//请求对象
					url:'add.php',
					type:'POST',							//方式
					//提交成功前
					beforeSubmit:function(formdata,jqForm,options){
									$('#reg').dialog('widget').find('button').eq(1).button('disable');
									$('#loading').dialog('open');
					},
					//提交成功后
					success:function(responseText,statusText){
						if(statusText === 'success'){									//responseText为php中echo返回的数据,类型为string
							$('#reg').dialog('widget').find('button').eq(1).button('enable');
							setTimeout(function(){						//2秒后执行
								$('#loading').dialog().html('数据成功提交...').css('background','url(css/images/对勾.png) no-repeat 20px center');
								setTimeout(function(){
									$('#loading').dialog('close');
									$('#reg').dialog('close');
									$('#reg').resetForm();						//清空表格
									$('#reg p .success').html('*').removeClass('success').css('color','red');
									//创建成功后加入cookie,并刷新
									$.cookie('user',responseText.slice(4));
									$('#user_a,#logout_a').show();
									$('#login_a,#reg_a').hide();
									$('#user_a').html($.cookie('user'));
								},2000);
							},2000);
						}else{
							alert('错误');
						}
					},
				});
			},
			ignoreTitle:true,					//jquery.validata会读取title值作为错误消息提示,禁用这个防止与其他插件冲突
		});
	});


	$('#tabs').tabs({		//使用jqueryUI插件
		collapsible:true,	//可折叠
		// active:2,				//初始时默认显示哪一个
		show:'slideDown',
		activate:function(event,ui){
		},
		beforeActivate:function(event,ui){
		},
		load:function(event,ui){					//ajax成功后执行
		},
		beforeLoad:function(event,ui){					//ajax成功后执行
		},
	});						
	

	$('#accordion').accordion();


	$('#question_button').button({
		icons:{
			primary:' ui-icon-lightbulb',
		},
	});
	
	$('#question_button').click(function(){
		if($.cookie('user')){
			$('#question').dialog('open');
		}else{
			$('#reg').dialog('open');
		}
	});




	



	$.ajax({
		url:'container.php',
		type:'POST',
		success:function(response,status,xhr){		//成功添加问题和回答内容
			var json = $.parseJSON(response);		//JSON->[对象,对象,...],用于添加到html中
			var html = '';							//要添加的html
			var arr = [];							//存放原本字数的editor内容
			var summary = [];						//存放有限字数的editor内容
			var id = [];							//存放问题编号
			var count = [];							//存放问题评论数
			$.each(json,function(index,value){	
				html += '<h4>'  + value.user + ' 发表于 ' + value.date + '</h4>' 
				+ '<h3>'+ value.title + '</h3>' + '<div class="editor">' + value.content + '</div>'
				+ '<div class="bottom"><span class="count"><span class="number_comment">' + value.count + '条评论(点击查看)</span></span><span class="up">收起</span></div><div class="clear"></div><hr noshade="noshade" size="1"><div class="comment"><div class="comment_list" "></div><div class="show_more_comment"></div><form class="write_comment" ><textarea name="comment_text"  class="comment_text">输入你的评论...</textarea><p><button type="button" class="comment_submit" >发表</button></p></form></div>';
				id[index] = value.id;
				count[index] = value.count;
			});

			$('#container').append(html);					//拼装好的html添加到div中

			$.each($('.editor'),function(index,value){
				arr[index] = $(value).html();
				summary[index] = arr[index].substring(0,200);

				if(summary[index].substring(199,200) == '<'){		//截取[199,200)的字符
					summary[index] = summary[index].substring(0,199);
				}if(summary[index].substring(198,200) == '</'){
					summary[index] = summary[index].substring(0,198);
				}
				if(arr[index].length > 200){
					summary[index] += '......  <span class="down" style="cursor:pointer;">全部显示</span>';
					$(value).html(summary[index]);
				}
				$('.bottom .up').eq(index).hide();
				$('.comment').eq(index).hide();
			});

			//全部显示
			$.each($('.editor'),function(index,value){
				$(this).on('click','.down',function(){					//采用事件委托,因为down是动态生成的,重新生成后绑定的事件就没有了
					$('.editor').eq(index).html(arr[index]);
					$(this).hide();
					$('.bottom .up').eq(index).show();
				});
			});

			//收起
			$.each($('.bottom'),function(index,value){
				$(this).on('click','.up',function(){
					$('.editor').eq(index).html(summary[index]);
					$(this).hide();
					$('.bottom .down').eq(index).show();
				});
			});

			


			//点击评论
			$.each($('.count'),function(index,value){
				var i = index;
				$('.count').eq(i).button().click(function(){
					if(!$.cookie('user')){					//没登录无法评论
						$('#login').dialog('open');
					}else{
						$.ajax({
							url:'paging.php',
							type:'POST',
							data:{
								titleid:id[i],
								page:2,
							},
							beforeSend:function(){
								if($('.comment').eq(i).is(':hidden')){
									$('#loading').dialog('open');
								}
								$('.count').eq(i).button('disable');
							},
							success:function(responseText,statusText){
								var comment_time = new Date();
								var year = comment_time.getFullYear();
								var month = comment_time.getMonth() + 1;
								var date = comment_time.getDate();
								var hour = comment_time.getHours();
								var minutes = comment_time.getMinutes();
								var seconds = comment_time.getSeconds();
								setTimeout(function(){
								//统一操作
									$('#loading').dialog('close');
									var json = $.parseJSON(responseText);
									var html = '';
									$.each(json,function(index,value){
										html += '<dl><dt>' + value.user + '发表于 ' + value.date + '</dt><dd>' + value.comment + '</dd></dl>';
									});
									//分情况1:评论超过5条 2:小于等于5条
									//评论超过5条
									if(count[i] > 5){
										html += '<span class="load_more">加载更多</span>'
										$('.comment_list').eq(i).html('').append(html);

										//判断评论有无显示
										if($('.comment').eq(i).is(':hidden')){					
											setTimeout(function(){
												$('#loading').dialog('close');
												$('.comment').eq(i).show();
												$('.count').eq(i).button('enable');
												//提交评论
												$('.comment_submit').eq(i).button().unbind('click').click(function(){			
													//先解绑click事件,防止多次$('.bottom').click()给其绑定太多的click事件,需要解除上次click事件,绑定本次click		
													$('.write_comment').eq(i).ajaxSubmit({		//发表评论
														url:'comment.php',
														type:'POST',
														data:{
															user:$.cookie('user'),
															titleid: id[i],					//获得对应的问题编号
														},
														beforeSubmit:function(){
															$('#loading').dialog('open');
														},
														success:function(responseText,statuaText){
															$('#loading').dialog('close');
															var new_count = ++count[i];			//每次成功添加,评论数加1
															$('.comment_list').prepend('<dl><dt>' + $.cookie('user') + '发表于 ' + year + '-0' + month + '-' + date + ' '+ hour +':'+ minutes + ':' + seconds + '</dt><dd>' + $('.comment_text').eq(i).val() + '</dd>');
															$('.number_comment').eq(i).html(new_count + '条评论(点击查看)');
														},
													});
												});
										},100);


										$('.load_more').button().unbind('click').click(function(){
											$.ajax({
												url:'show_comment.php',
												type:'POST',
												data:{
													id:id[i],
												},
												beforeSend:function(){
													if($('.comment').eq(i).is(':hidden')){
														$('#loading').dialog('open');
													}
													$('.load_more').button('disable');
												},
												success:function(responseText,statusText){

													var json = $.parseJSON(responseText);		//JSON->[对象,对象,...],用于添加到html中
													var html = '';
													$.each(json,function(index,value){	
														html += '<dl><dt>' + value.user + '发表于 ' + value.date + '</dt><dd>' + value.comment + '</dd></dl>';
													});
													setTimeout(function(){
														$('#loading').dialog('close');
														$('.load_more').button('enable');
														$('.comment_list').eq(i).html('').append(html);
														$('.comment').eq(i).show();
														$('.count').eq(i).button('enable');
													},100);
												},
											});
										});

									}else{
										$('.comment').eq(index).hide();
										$('.count').eq(i).button('enable');
									}

									
								}

								//评论小于等于5条
								else{
									//判断评论有无显示
									if($('.comment').eq(i).is(':hidden')){
											setTimeout(function(){
												$('#loading').dialog('close');
												$('.comment_list').eq(i).html('').append(html);
												$('.comment').eq(i).show();
												$('.count').eq(i).button('enable');
												$('.comment_submit').eq(i).button().unbind('click').click(function(){
													//先解绑click事件,防止多次$('.bottom').click()给其绑定太多的click事件,需要解除上次click事件,绑定本次click		
													$('.write_comment').eq(i).ajaxSubmit({		//发表评论
														url:'comment.php',
														type:'POST',
														data:{
															user:$.cookie('user'),
															titleid: id[i],					//获得对应的问题编号
														},
														beforeSubmit:function(){
															$('#loading').dialog('open');
														},
														success:function(responseText,statuaText){
															$('#loading').dialog('close');
															var new_count = ++count[i];			//每次成功添加,评论数加1
															$('.comment_list').prepend('<dl><dt>' + $.cookie('user') + '发表于 ' + year + '-0' + month + '-' + date + ' '+ hour +':'+ minutes + ':' + seconds + '</dt><dd>' + $('.comment_text').eq(i).val() + '</dd>');
															$('.number_comment').eq(i).html(new_count + '条评论(点击查看)');
														},
													});
												});
										},100);
									}else{
										$('.comment').eq(index).hide();
										$('.count').eq(i).button('enable');
									}
								}
							},100);
							
						},
					});
				}
			});

			});
		},				
					
	});
	


	

});