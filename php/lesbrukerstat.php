<html lang='no'>
<head>
<link rel="stylesheet" href="../css/jquery-mobile-theme.min.css" />
<link rel="stylesheet" href="../css/jquery.mobile.icons.min.css" />
<link rel="stylesheet" href="../css/jquery.mobile.structure-1.4.5.min.css" />
<script src="../js/jquery-1.11.1.min.js" type="text/javascript"></script>
<script src="../js/jquery.mobile-1.4.5.min.js" type="text/javascript"></script>
<style>
table {
	text-align:center;	
}

thread {
	text-align:center;	
}

tbody {
	text-align:center;	
}
thead th,
tbody tr:last-child {
    border-bottom: 1px solid #d6d6d6; /* non-RGBA fallback */
    border-bottom: 1px solid rgba(0,0,0,.1);
}
tbody th,
tbody td {
    border-bottom: 1px solid #e6e6e6; /* non-RGBA fallback  */
    border-bottom: 1px solid rgba(0,0,0,.05);
}
tbody tr:last-child th,
tbody tr:last-child td {
    border-bottom: 0;
}
tbody tr:nth-child(odd) td,
tbody tr:nth-child(odd) th {
    background-color: #eeeeee; /* non-RGBA fallback  */
    background-color: rgba(0,0,0,.04);
}
</style>
<title>Brukerstatistikk for Sosialapp</title>
</head>
<body>
<div data-role='page' data-theme='a'>
<div data-role='header' data-theme='a'>
<h1 style='text-align:center;font-size:2em;'>Brukerstatistikk for Sosialapp</h1>
</div>
<div data-role='content' class='ui-body-a'>
	<div class="ui-grid-solo">
    <div class="ui-block-a">
<form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>" >
<fieldset data-role='controlgroup' data-type='horizontal' data-mini='true' id='velgdata' data-theme='d'>
    <legend>Velg hvilke data du vil ha med i tabellen:</legend>
	<input name='startbruk' id='startbruk' <?php if (isset($_POST['startbruk'])){ echo "checked=''";}?> type='checkbox'>
    <label for='startbruk'>Startdato bruk</label>
    <input name='startdato' id='startdato' <?php if (isset($_POST['startdato'])){ echo "checked=''";}?> type='checkbox'>
    <label for='startdato'>Startdato øvinger</label>
    <input name='sistbrukt' id='sistbrukt' <?php if (isset($_POST['sistbrukt'])){ echo "checked=''";}?> type='checkbox'>
    <label for='sistbrukt'>Sist brukt dato</label>
    <input name='antall' id='antall' <?php if (isset($_POST['antall'])){ echo "checked=''";}?> type='checkbox'>
    <label for='antall'>Ant. øvinger utført</label>
	<input name='ant_dager' id='ant_dager' <?php if (isset($_POST['ant_dager'])){ echo "checked=''";}?> type='checkbox'>
    <label for='ant_dager'>Ant. dager brukt</label>
	<input name='ant_aapnet' id='ant_aapnet' <?php if (isset($_POST['ant_aapnet'])){ echo "checked=''";}?> type='checkbox'>
    <label for='ant_aapnet'>Ant. ganger åpnet</label>
    <input name='oving1' id='oving1' <?php if (isset($_POST['oving1'])){ echo "checked=''";}?> type='checkbox'>
    <label for='oving1'>Øving dag 1</label>
    <input name='oving2' id='oving2' <?php if (isset($_POST['oving2'])){ echo "checked=''";}?> type='checkbox'>
    <label for='oving2'>Øving dag 2</label>
    <input name='oving3' id='oving3' <?php if (isset($_POST['oving3'])){ echo "checked=''";}?> type='checkbox'>
    <label for='oving3'>Øving dag 3</label>
    <input name='oving4' id='oving4' <?php if (isset($_POST['oving4'])){ echo "checked=''";}?> type='checkbox'>
    <label for='oving4'>Øving dag 4</label>
    <input name='oving5' id='oving5' <?php if (isset($_POST['oving5'])){ echo "checked=''";}?> type='checkbox'>
    <label for='oving5'>Øving dag 5</label>
    <input name='oving6' id='oving6' <?php if (isset($_POST['oving6'])){ echo "checked=''";}?> type='checkbox'>
    <label for='oving6'>Øving dag 6</label>
    <input name='oving7' id='oving7' <?php if (isset($_POST['oving7'])){ echo "checked=''";}?> type='checkbox'>
    <label for='oving7'>Øving dag 7</label>
</fieldset>
<input type='submit' data-theme='c' name='submit' value='Fyll tabell'>
</form>
</div>
</div>

<?php
$fil = "regbrukerdata.txt";
$json = json_decode(file_get_contents($fil), true);
$arrleng = count($json);
echo "</h2>Totalt antall brukere: ".$arrleng."</h2>";
?>
<table data-role='table' data-mode='' class='ui-responsive table-stroke' data-column-btn-theme='a' data-column-btn-text='' id='vistabell'>
<?php
if (isset ($_POST['submit'])){
	
	if (isset($_POST['startbruk'])){
		$med_startbruk=1;
	}else {
		$med_startbruk=0;
	}
	if (isset($_POST['startdato'])){
		$med_startdato=1;
	}else {
		$med_startdato=0;
	}
	if (isset($_POST['sistbrukt'])){
		$med_sistbrukt=1;
	}
	else {
		$med_sistbrukt=0;
	}
	if (isset($_POST['antall'])){
		$med_antall=1;
	}
	else {
		$med_antall=0;
	}
	if (isset($_POST['ant_dager'])){
		$med_dager=1;
	}
	else {
		$med_dager=0;
	}
	if (isset($_POST['ant_aapnet'])){
		$med_aapnet=1;
	}
	else {
		$med_aapnet=0;
	}
	if (isset($_POST['oving1'])){
		$med_oving1=1;
	}
	else {
		$med_oving1=0;
	}
	if (isset($_POST['oving2'])){
		$med_oving2=1;
	}
	else {
		$med_oving2=0;
	}
	if (isset($_POST['oving3'])){
		$med_oving3=1;
	}
	else {
		$med_oving3=0;
	}
	if (isset($_POST['oving4'])){
		$med_oving4=1;
	}
	else {
		$med_oving4=0;
	}
	if (isset($_POST['oving5'])){
		$med_oving5=1;
	}
	else {
		$med_oving5=0;
	}
	if (isset($_POST['oving6'])){
		$med_oving6=1;
	}
	else {
		$med_oving6=0;
	}
	if (isset($_POST['oving7'])){
		$med_oving7=1;
	}
	else {
		$med_oving7=0;
	}
	
echo "
	<thead>
	<tr style='background-color:#eeeeee;border: 1px solid #000000'>
	<th>Bruker</th>";
	if ($med_startbruk==1){
		echo "<th>Startdato bruk</th>";
	}
	if ($med_startdato==1){
		echo "<th>Startdato øvinger</th>";
	}
	if ($med_sistbrukt==1){
		echo "<th>Sist brukt dato</th>";
	}
	if ($med_antall==1){
	echo "<th>Ant.øv. utført</th>";
	}

	if ($med_dager==1){
		echo "<th>Ant. dager brukt</th>";
	}

	if ($med_aapnet==1){
		echo "<th>Ant. ganger åpnet</th>";
	}
	
	if ($med_oving1==1){
		echo "<th>Dag 1</th>
		<th>Før</th>
		<th>Etter</th>";
	}
	if ($med_oving2==1){
		echo "<th>Dag 2</th>
		<th>Før</th>
		<th>Etter</th>";
	}
	if ($med_oving3==1){
		echo "<th>Dag 3</th>
		<th>Før</th>
		<th>Etter</th>";
	}
	if ($med_oving4==1){
		echo "<th>Dag 4</th>
		<th>Før</th>
		<th>Etter</th>";
	}
	if ($med_oving5==1){
		echo "<th>Dag 5</th>
		<th>Før</th>
		<th>Etter</th>";
	}
	if ($med_oving6==1){
		echo "<th>Dag 6</th>
		<th>Før</th>
		<th>Etter</th>";
	}
	if ($med_oving7==1){
		echo "<th>Dag 7</th>
		<th>Før</th>
		<th>Etter</th>";
	}
	echo "</tr>
	</thead><tbody>";
$antall=0;
foreach ($json as $key => $value) {
	$antall=$antall+1;
	$start = strtotime($json[$key]['startbruk']);
	$sist = strtotime($json[$key]['idag']);
	$dager = ceil(abs($sist - $start) / 86400);
	
	echo "<tr style='border:1px solid #000000;'>
	<td>".$antall."</td>";
	if ($med_startbruk==1){
		echo "<td>".$json[$key]['startbruk']."</td>";
	}
	if ($med_startdato==1){
		echo "<td>".$json[$key]['startdato']."</td>";
	}
	if ($med_sistbrukt==1){
		echo "<td>".$json[$key]['idag']."</td>";
	}
	if ($med_antall==1){
		echo "<td>".$json[$key]['antall']."</td>";
	}
	if ($med_dager==1){
		echo "<td>".$dager."</td>";
	}
	if ($med_aapnet==1){
		echo "<td>".$json[$key]['antbruk']."</td>";
	}
	if ($med_oving1==1){
		if ($json[$key]['ovingutf0']==1){
			echo "<td>Ja</td>
			<td>".$json[$key]['evalfor0']."</td>
			<td>".$json[$key]['evaletter0']."</td>";
		}
		else {
			echo "<td>Nei</td>
			<td></td>
			<td></td>";	
		}
	}
	if ($med_oving2==1){
		if ($json[$key]['ovingutf1']==1){
			echo "<td>Ja</td>
			<td>".$json[$key]['evalfor1']."</td>
			<td>".$json[$key]['evaletter1']."</td>";
		}
		else {
			echo "<td>Nei</td>
			<td></td>
			<td></td>";	
		}
	}
	if ($med_oving3==1){
		if ($json[$key]['ovingutf2']==1){
			echo "<td>Ja</td>
			<td>".$json[$key]['evalfor2']."</td>
			<td>".$json[$key]['evaletter2']."</td>";
		}
		else {
			echo "<td>Nei</td>
			<td></td>
			<td></td>";	
		}
	}
	if ($med_oving4==1){
		if ($json[$key]['ovingutf3']==1){
			echo "<td>Ja</td>
			<td>".$json[$key]['evalfor3']."</td>
			<td>".$json[$key]['evaletter3']."</td>";
		}
		else {
			echo "<td>Nei</td>
			<td></td>
			<td></td>";	
		}
	}
	if ($med_oving5==1){
		if ($json[$key]['ovingutf4']==1){
			echo "<td>Ja</td>
			<td>".$json[$key]['evalfor4']."</td>
			<td>".$json[$key]['evaletter4']."</td>";
		}
		else {
			echo "<td>Nei</td>
			<td></td>
			<td></td>";	
		}
	}
	if ($med_oving6==1){
		if ($json[$key]['ovingutf5']==1){
			echo "<td>Ja</td>
			<td>".$json[$key]['evalfor5']."</td>
			<td>".$json[$key]['evaletter5']."</td>";
		}
		else {
			echo "<td>Nei</td>
			<td></td>
			<td></td>";	
		}
	}
	if ($med_oving7==1){
		if ($json[$key]['ovingutf6']==1){
			echo "<td>Ja</td>
			<td>".$json[$key]['evalfor6']."</td>
			<td>".$json[$key]['evaletter6']."</td>";
		}
		else {
			echo "<td>Nei</td>
			<td></td>
			<td></td>";	
		}
	}
	
	echo "
	</tr>";
	}
	echo "</tbody>
	</table>";
}
?>
</table>
</div>
</div>

</body>
</html>
