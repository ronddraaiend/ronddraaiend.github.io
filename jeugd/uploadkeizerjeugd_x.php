<?php
  if( ! empty($_POST['btnsubmit'])) :
    $password = $_POST['txtpassword'];
    if( $password == 'kronenburg' ) : 
      $srcfilenames = Array('keizer1filename','keizer2filename','keizer3filename', 'keizer4filename','keizer5filename', 'keizer6filename');
      $destfilenames = Array('keizerstap1.csv','keizerstap2.csv', 'keizerstap3.csv', 'keizerstap4.csv', 'keizerstap5.csv', 'keizerstap6.csv');
      $s = '';
      for( $i = 0; $i < count($srcfilenames); $i++ ) :
        if( $_FILES[$srcfilenames[$i]]['name'] != '' ) :
          $f = $_FILES[$srcfilenames[$i]];
          if( $f['error'] == 0 ) :
            move_uploaded_file( $f['tmp_name'], $destfilenames[$i]);
            $s .= "Bestand ${f['name']} op de server geplaatst<br>";
          else :
            $s .= "uploaden ${f['name']} mislukt<br>";
          endif;
        else :
            $s .= 'Bestand ' . ($i+1) . ' was niet ingevuld<br>';
        endif;
      endfor;  
    else :
      $s = 'Onjuist wachtwoord';
    endif;
  endif;
?>
<!doctype html>
<html>
<head>
<title>Uploaden toernooibestand</title>
</head>

<h2>Uploaden keizerbestanden</h2>
<?php
  if ( isset( $s )) :
    print "<div>$s</div><br>";
  endif;
?>
<p><a href="interneCompetitieStand.html">Terug naar standen</a></p>
<form action="" method="POST" enctype="multipart/form-data">
<fieldset style="width:600px;">
<legend>Specificeer (een of meer) keizer-bestanden</legend>
<table>
<tr><td>Keizer Stap 1 (middag):</td><td> 
<input type="file" name="keizer1filename">
</td></tr>
<tr><td>Keizer Stap 1 plus (middag):</td><td> 
<input type="file" name="keizer2filename">
</td></tr>
<tr><td>Keizer Stap 1 (avond):</td><td> 
<input type="file" name="keizer3filename">
</td></tr>
<tr><td>Keizer Stap 1 plus / Stap 2 (avond):</td><td> 
<input type="file" name="keizer4filename">
</td></tr>
<tr><td>Keizer Stap 2 plus / Stap 3 (avond):</td><td> 
<input type="file" name="keizer5filename">
</td></tr>
<tr><td>Keizer Stap 3 plus / Stap 4 / Stap 4 plus (avond):</td><td> 
<input type="file" name="keizer6filename">
</td></tr>

<tr><td>Wachtwoord:</td> 
<td><input name="txtpassword" type="password" required>
</td></tr>
<tr><td colwidth=2>
<input type="submit" value="Uploaden" name="btnsubmit">
</td></tr>
</fieldset>
</form>
</html>
