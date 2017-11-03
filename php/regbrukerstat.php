<?php

$uid= $_POST['uid'];

$fil = "regbrukerdata.txt";
$json = json_decode(file_get_contents($fil), true);
$startbruk=$_POST['startbruk'];
$startdato = $_POST['startdato'];
$idag = $_POST['idag'];
$antall = $_POST['antall'];
$antbruk=$_POST['antbruk'];
$ovingutf0 = $_POST['ovingutf0'];
$evalfor0 =$_POST['evalfor0'];
$evaletter0 =$_POST['evaletter0'];
$ovingutf1 = $_POST['ovingutf1'];
$evalfor1 =$_POST['evalfor1'];
$evaletter1 =$_POST['evaletter1'];
$ovingutf2 = $_POST['ovingutf2'];
$evalfor2 =$_POST['evalfor2'];
$evaletter2 =$_POST['evaletter2'];
$ovingutf3 = $_POST['ovingutf3'];
$evalfor3 =$_POST['evalfor3'];
$evaletter3 =$_POST['evaletter3'];
$ovingutf4 = $_POST['ovingutf4'];
$evalfor4 =$_POST['evalfor4'];
$evaletter4 =$_POST['evaletter4'];
$ovingutf5 = $_POST['ovingutf5'];
$evalfor5 =$_POST['evalfor5'];
$evaletter5 =$_POST['evaletter5'];
$ovingutf6 = $_POST['ovingutf6'];
$evalfor6 =$_POST['evalfor6'];
$evaletter6 =$_POST['evaletter6'];

$json[$uid] = array("startbruk" => $startbruk, "startdato" => $startdato, "idag" => $idag, "antall" => $antall, "antbruk" =>$antbruk, "ovingutf0" => $ovingutf0, "evalfor0" => $evalfor0, "evaletter0" => $evaletter0, "ovingutf1" => $ovingutf1, "evalfor1" => $evalfor1, "evaletter1" => $evaletter1, "ovingutf2" => $ovingutf2, "evalfor2" => $evalfor2, "evaletter2" => $evaletter2, "ovingutf3" => $ovingutf3, "evalfor3" => $evalfor3, "evaletter3" => $evaletter3, "ovingutf4" => $ovingutf4, "evalfor4" => $evalfor4, "evaletter4" => $evaletter4, "ovingutf5" => $ovingutf5, "evalfor5" => $evalfor5, "evaletter5" => $evaletter5, "ovingutf6" => $ovingutf6, "evalfor6" => $evalfor6, "evaletter6" => $evaletter6);

file_put_contents($fil, json_encode($json));

?>