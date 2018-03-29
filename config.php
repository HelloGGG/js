<?php 
	header("Content-type:text/html;charset=utf-8");
	$con=mysqli_connect("localhost","root","123456","test");
	$user  = $_POST['user'];
	$pass  = $_POST['pass'];
	$email = $_POST['email'];
	$birth = $_POST['birth'];
	$sex = $_POST['sex'];
	$regTime = $_POST['dataTime'];
 ?>