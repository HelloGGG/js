<?php 
	require 'config.php';
	$sql = "SELECT user FROM reg WHERE (user='$user' && pass='$pass')" ;
	$result = mysqli_query($con,$sql);
	$row = mysqli_fetch_row($result);
	if($row){
		echo 'true';
	}else{
		echo 'false';
	}
	echo $user;
	mysqli_close($con);
 ?>