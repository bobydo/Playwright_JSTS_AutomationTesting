import { Page, Locator } from '@playwright/test';
import { CommonSelectors } from '../Common/CommonSelectors';

export class LoginPage {
  readonly page: Page;
  readonly userName: Locator;
  readonly password: Locator;
  readonly signIn: Locator;
  readonly cardTitles: Locator;
  readonly documentLink: Locator;
  readonly dropdown: Locator;
  readonly radioLast: Locator;
  readonly okayBtn: Locator;
  readonly terms: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userName = page.locator(CommonSelectors.userName);
    this.password = page.locator(CommonSelectors.password);
    this.signIn = page.locator(CommonSelectors.signIn);
    this.cardTitles = page.locator(CommonSelectors.cardTitles);
    this.documentLink = page.locator(CommonSelectors.documentLink);
    this.dropdown = page.locator(CommonSelectors.dropdown);
    this.radioLast = page.locator(CommonSelectors.radioLast).last();
    this.okayBtn = page.locator(CommonSelectors.okayBtn);
    this.terms = page.locator(CommonSelectors.terms);
  }

  async goto() {
    await this.page.goto('https://rahulshettyacademy.com/loginpagePractise/');
  }

  async login(username: string, password: string) {
    await this.userName.fill(username);
    await this.password.fill(password);
    await this.signIn.click();
  }

  async getErrorText() {
    return this.page.locator(CommonSelectors.errorBlock).textContent();
  }

  async getCardTitles() {
    return this.cardTitles.allTextContents();
  }

  async selectConsultOption() {
    await this.dropdown.selectOption('consult');
  }

  async selectLastRadio() {
    await this.radioLast.click();
    await this.okayBtn.click();
  }

  async checkTerms() {
    await this.terms.click();
  }

  async uncheckTerms() {
    await this.terms.uncheck();
  }
}