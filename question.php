<?php 
	$conn = mysqli_connect('localhost','root','123456','test');

	$user = $_POST['user'];
	$title = $_POST['title'];
	$content = $_POST['content'];

	$sql = "INSERT INTO question(user,title,content,date) VALUES ('$user','$title','$content',NOW())";
	if(mysqli_query($conn,$sql)){
		echo '发表成功';
	}else{
		echo '插入数据错误';
	}

 ?>