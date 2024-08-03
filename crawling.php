<?php
// 크롤링할 URL 설정
// $url = 'https://www.alio.go.kr/item/itemOrganList.do?reportFormRootNo=80104&quart=4';
$url = 'https://www.alio.go.kr/item/itemOrganList.do?reportFormRootNo=80104&quart=4';

// cURL 세션 초기화
$ch = curl_init();

// 옵션 설정
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true); // 리다이렉션 허용


// URL의 HTML 데이터를 가져옴
$html = curl_exec($ch);


// cURL 세션 종료
curl_close($ch);

if ($html === false) {
  die('Error fetching the URL');
}

// 로그 파일에 $html 값을 저장
$logFile = fopen('log.html', 'w');
fwrite($logFile, $html);
fclose($logFile);

if (empty($html)) {
  die('Fetched HTML is empty');
}


// HTML 파싱을 위한 DOMDocument 객체 생성
$dom = new DOMDocument();
libxml_use_internal_errors(true); // HTML 파싱 오류 무시
$dom->loadHTML($html);
libxml_clear_errors();

// XPath 객체 생성
$xpath = new DOMXPath($dom);

// 모든 링크(href 속성) 추출
$links = [];
foreach ($xpath->query('//a[@href]') as $node) {
  $links[] = $node->getAttribute('href');
}

// CSV 파일로 저장
$csvFile = fopen('output.csv', 'w');
fputcsv($csvFile, ['Link']);
foreach ($links as $link) {
  fputcsv($csvFile, [$link]);
}
fclose($csvFile);

echo 'CSV 파일이 성공적으로 작성되었습니다.';
?>