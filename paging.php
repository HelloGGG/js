<?php 
	sleep(1);

	$conn = mysqli_connect('localhost','root','123456','test');
	$titleid = $_POST['titleid'];
	$sql = mysqli_query($conn,"SELECT COUNT(*) AS count FROM comment WHERE titleid = $titleid");		//返回结果集
	$result = mysqli_fetch_array($sql,MYSQLI_ASSOC);
	$page = 1;							//初始页码
	$pagesize = 5;						//设置每页最多5条记录
	$count = ceil($result['count']/$pagesize);			//设置最大页数    ceil();向上取整.
	if(!isset($_POST['page'])){				//传递页码
		$page = 1;
	}else{
		$page = $_POST['page'];
		if($page > $count){
			$page = $count;
		}
	}
	$limit = ($page -1) * $pagesize;

	$id = $_POST['titleid'];
		$query = mysqli_query($conn,"SELECT * FROM comment WHERE titleid = $id ORDER BY date DESC LIMIT 0,5");//限制一次最多选2条  $limit,$pagesize
		$type = is_bool($query);
		if($type === true){		//查找成功,返回的是空集合,没有结果集,所以是true
			echo '[]';			
			mysqli_free_result($sql);
			mysqli_close($conn);
		}else{					//查找成功,返回结果集,不是boolean类型
			$json ='';							
			$arr1 = array("\n","\"");												
			$arr2 = array("","'");											
			while(!!$row = mysqli_fetch_array($query,MYSQLI_ASSOC)){
				foreach($row as $key => $value){
					$row[$key] = urlencode(str_replace($arr1, $arr2,$value));			//编码,防止乱码
				}
				$json .= urldecode(json_encode($row)).',';								//解码
			}
			echo '['.substr($json,0,strlen($json)-1).']';	
			mysqli_free_result($query);
			mysqli_free_result($sql);
			mysqli_close($conn);
		}
 ?>