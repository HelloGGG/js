<?php 
	require 'config.php';
	
	$sql = "SELECT user FROM reg WHERE user='$user'";
	$result = mysqli_query($con,$sql);
	$row = mysqli_fetch_row($result);
	if($row){
		echo 'false';
	}else{
		echo 'true';
	}
	mysqli_close($con);
 ?>