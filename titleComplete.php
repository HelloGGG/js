<?php 
	$conn = mysqli_connect('localhost','root','123456','test');

	$sql = "SELECT title FROM question";
	$result = mysqli_query($conn,$sql);

	$json ='';
	$arr1 = array("\n","\"");
	$arr2 = array("","'");
	while($row = mysqli_fetch_array($result,MYSQLI_ASSOC)){			//$row 是一个数组 键为数据库表的列,相当于$row = array('title' => 'dsjakdjkasj');
		foreach($row as $key => $v){
			$row[$key] = urlencode(str_replace($arr1, $arr2, $v));
		}
		$json .= urldecode(json_encode($row)).',';		//json_encode() 该函数主要用来将数组和对象，转换为json格式
	}

	$json = '['.substr($json,0,strlen($json) - 1).']';		//转换成数组格式
	echo $json;
	mysqli_close($conn);
 ?>