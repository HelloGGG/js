<?php 
	$conn = mysqli_connect('localhost','root','123456','test');
	$titleid = $_POST['titleid'];
	$comment = $_POST['comment_text'];
	$user = $_POST['user'];
	$query = "INSERT INTO comment(titleid,comment,user,date) VALUES($titleid,'$comment','$user',NOW())";

	if(mysqli_query($conn,$query)){
		echo '评论成功';
	}else{
		echo '评论失败';
	}
	mysqli_close($conn);
 ?>