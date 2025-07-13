import { test, expect, BrowserContext, Page } from '@playwright/test';
import { LoginPage } from './Model/LoginPage';
import { extractDomainFromText } from './Common/LoginPageService';

test('@Web Browser Context-Validating Error login', async ({ browser }) => {
  const context: BrowserContext = await browser.newContext();
  const page: Page = await context.newPage();
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login('rahulshetty', 'learning');
  console.log(await page.title());
  console.log(await loginPage.getErrorText());
  await expect(page.locator('[style*="block"]')).toContainText('Incorrect');

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

  await loginPage.goto();
  await loginPage.selectConsultOption();
  await loginPage.selectLastRadio();
  console.log(await loginPage.radioLast.isChecked());
  await expect(loginPage.radioLast).toBeChecked();
  await loginPage.checkTerms();
  await expect(loginPage.terms).toBeChecked();
  await loginPage.uncheckTerms();
  expect(await loginPage.terms.isChecked()).toBeFalsy();
  await expect(loginPage.documentLink).toHaveAttribute('class', 'blinkingText');
});

test('@Child windows handle', async ({ browser }) => {
  const context: BrowserContext = await browser.newContext();
  const page: Page = await context.newPage();
  const loginPage = new LoginPage(page);

  await loginPage.goto();

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