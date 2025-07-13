import { test, expect, BrowserContext, Page } from '@playwright/test';
import { LoginPage } from './Model/LoginPage';
import { extractDomainFromText } from './Common/LoginPageService';
import { CommonSelectors } from './Common/CommonSelectors';

test('@Web Browser Context-Validating Error login', async ({ browser }) => {
  const context: BrowserContext = await browser.newContext();
  const page: Page = await context.newPage();
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login('rahulshetty', 'learning');
  console.log(await page.title());
  console.log(await loginPage.getErrorText());
  await expect(page.locator(CommonSelectors.errorBlock)).toContainText('Incorrect');

  await loginPage.userName.fill('');
  await loginPage.userName.fill('rahulshettyacademy');
  await loginPage.signIn.click();
  console.log(await loginPage.cardTitles.first().textContent());
  console.log(await loginPage.cardTitles.nth(1).textContent());
  const allTitles = await loginPage.getCardTitles();
  console.log(allTitles);
});

test('@Web UI Controls', async ({ page }) => {
  const loginPage = new LoginPage(page);
  console.log("run @Web UI Controls only");
  await loginPage.goto();
  await loginPage.selectConsultOption();
  await loginPage.selectLastRadio();
  console.log(await loginPage.radioLast.isChecked());
  await expect(loginPage.radioLast).toBeChecked();
  await loginPage.checkTerms();
  await expect(loginPage.terms).toBeChecked();
  await loginPage.uncheckTerms();
  //loginPage.terms.isChecked() returns a Promise<boolean>.
  //await the promise to get the boolean value, then pass it to expect.
  //This is a standard Jest/Playwright assertion on a value.
  //Move cursor to isChecked you will see promise
  //(method) Locator.isChecked(options?: {
  //  timeout?: number;
  //}) : Promise
  expect(await loginPage.terms.isChecked()).toBeFalsy();
  //Here, loginPage.documentLink is a Locator (not a value).
  //Playwright’s expect(locator) API is auto-waiting: 
  //it waits for the condition to be true within a timeout.
  //You must await the expect itself, because it’s asynchronous and handles retries internally.
  await expect(loginPage.documentLink).toHaveAttribute('class', 'blinkingText');
});

test('@Child windows handle', async ({ browser }) => {
  //browser.newContext(); indeed creates a new browsing context 
  //that allows for isolated sessions,
  const context: BrowserContext = await browser.newContext();
  const page: Page = await context.newPage();
  const loginPage = new LoginPage(page);

  await loginPage.goto();

  //Promise.all guarantees that you will get the new Page object as soon as the new tab 
  //or window is opened as a result of the click.
  // Object	Event Name	Purpose
  // context	'page'	Wait for new tab/window in the context
  // page	'popup'	Wait for popup opened from this page
  // page	'request'	Wait for network request => such as an API call, image load, CSS/JS file, etc
  // page	'dialog'	Wait for alert/confirm/prompt dialog
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    loginPage.documentLink.click(),
  ]);

  const text = await newPage.locator('.red').textContent();
  if (!text) throw new Error('No text found in .red element');
  const domain = extractDomainFromText(text);
  console.log(domain);
  await loginPage.userName.fill(domain);
  console.log(await loginPage.userName.inputValue());
});