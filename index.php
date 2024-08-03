<?php
ini_set("allow_url_fopen", 1);
include './simplehtmldom_1_9_1/simple_html_dom.php';
$data = file_get_html("https://www.alio.go.kr/item/itemOrganList.do?reportFormRootNo=80104&quart=4");
// echo $data;
?>

<!DOCTYPE html>
<html lang="ko">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body>
  <div><?php echo $data ?></div>



</body>

</html>