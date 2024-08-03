const puppeteer = require("puppeteer");
const fs = require("fs");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    "https://www.alio.go.kr/item/itemOrganList.do?reportFormRootNo=80104&quart=4",
    { waitUntil: "networkidle2" }
  );

  // 특정 div 태그 안의 class="t-content" 요소 가져오기
  const tContents = await page.evaluate(() => {
    const elements = document.querySelectorAll("div.t-content li");
    return Array.from(elements).map((element) => {
      const spans = element.querySelectorAll("span");
      return Array.from(spans).map((span) => ({
        text: span.textContent.trim(),
        href: span.getAttribute("href"),
      }));
    });
  });

  // const tContents = await page.evaluate(() => {
  //   const elements = document.querySelectorAll("div.t-content li");
  //   return Array.from(elements).map((element) => {
  //     const spans = element.querySelectorAll("span.bt a");
  //     return Array.from(spans).map((span) => ({
  //       text: span.textContent.trim(),
  //       href: span.getAttribute("href"),
  //     }));
  //   });
  // });

  await browser.close();

  const rowCount = tContents.length;
  console.log(`Row count: ${rowCount}`);
  // CSV 파일로 저장
  const csvWriter = createCsvWriter({
    path: "output.csv",
    header: [
      { id: "column1", title: "기관명" },
      { id: "column2", title: "기관유형" },
      { id: "column3", title: "주무부처" }, // 필요한 만큼 열 추가
      { id: "column4", title: "분기" }, // 필요한 만큼 열 추가
      { id: "column5", title: "보고서" }, // 필요한 만큼 열 추가
      { id: "column6", title: "첨부파일" }, // 필요한 만큼 열 추가
    ],
  });

  // CSV 파일에 기록할 데이터 준비
  const records = tContents.map((row) => {
    return {
      column1: row[0] || "",
      column2: row[1] || "",
      column3: row[2] || "", // 필요한 만큼 열 추가
      column4: row[3] || "", // 필요한 만큼 열 추가
      column5: row[4] || "", // 필요한 만큼 열 추가
      column6: row[5] || "", // 필요한 만큼 열 추가
    };
  });

  csvWriter.writeRecords(records).then(() => {
    console.log("CSV 파일이 성공적으로 작성되었습니다.");
  });
})();
