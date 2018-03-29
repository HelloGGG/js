<?php 
	require 'config.php';
	$sql = "INSERT INTO reg(user, pass, email,birth,sex,regTime) VALUES ('$user','$pass','$email','$birth','$sex',NOW())";
	if(!(mysqli_query($con,$sql))){
	   // echo "数据插入失败";
	 }else{
	   echo "注册成功";
	 }
	echo $user;
	mysqli_close($con);
?>
