const ExcelJs =require('exceljs');
const { test, expect } = require('@playwright/test');
const { FileHelper } = require('../utils/FileHelper');

let fileHelper = new FileHelper();

async function writeExcelTest(searchText,replaceText,change,filePath)
{
  const workbook = new ExcelJs.Workbook();
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.getWorksheet('Sheet1');
  const output= await readExcel(worksheet,searchText);
  const cell = worksheet.getCell(output.row,output.column+change.colChange);
  cell.value = replaceText;
  await workbook.xlsx.writeFile(filePath);
}
async function readExcel(worksheet,searchText)
{
    let output = {row:-1,column:-1};
    worksheet.eachRow((row,rowNumber) =>
    {
          row.eachCell((cell,colNumber) =>
          {
              if(cell.value === searchText)
              {
                  output.row=rowNumber;
                  output.column=colNumber;
              }
          }  )
    })
    return output;
}
//update Mango Price to 350. 
//writeExcelTest("Mango",350,{rowChange:0,colChange:2},"/Users/rahulshetty/downloads/excelTest.xlsx");
test('Upload download excel validation',async ({page})=>
{
  const textSearch = 'Mango';
  const updateValue = '350';
  await page.goto("https://rahulshettyacademy.com/upload-download-test/index.html");
  
  // Use Promise.all to wait for both the download event and the button click.
  // Use the download object to save the file to your desired path.
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Download' }).click()
  ]);
  await download.saveAs(fileHelper.getDownloadFilePath());
  
  writeExcelTest(textSearch,updateValue,{rowChange:0,colChange:2},fileHelper.getDownloadFilePath());
  await page.locator("#fileinput").click();
  await page.locator("#fileinput").setInputFiles(fileHelper.getDownloadFilePath());
  const textlocator = page.getByText(textSearch);
  const desiredRow = await page.getByRole('row').filter({has :textlocator });
  await expect(desiredRow.locator("#cell-4-undefined")).toContainText(updateValue);
})







