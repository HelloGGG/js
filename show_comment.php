<?php 
	sleep(1);
	$conn = mysqli_connect('localhost','root','123456','test');

	$id = $_POST['id'];
	$query = "SELECT * FROM comment WHERE titleid = $id ORDER BY date DESC";
	$result = mysqli_query($conn,$query) or die('SQL错误!');
										//从结果集中取得一行作为数字数组或关联数组,MYSQLI_ASSOC,关联数组,比如:$row['title']
	$json ='';							//设置json对象
										//php的单引号中全部都是字符串,不管有没有转义,双引号则会解释和转义
	$arr1 = array("\n","\"");			//需要替换的特出字符										
	$arr2 = array("","'");				//代替后的字符							
	while(!!$row = mysqli_fetch_array($result,MYSQLI_ASSOC)){
		foreach($row as $key => $value){
			$row[$key] = urlencode(str_replace($arr1, $arr2,$value));			//编码,防止乱码
		}
		$json .= urldecode(json_encode($row)).',';								//解码
	}
	echo '['.substr($json,0,strlen($json)-1).']';				//转化为json数组,数组里都是对象

	mysqli_free_result($result);				//释放结果集
	mysqli_close($conn);		
 ?>