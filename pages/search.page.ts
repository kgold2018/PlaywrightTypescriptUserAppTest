import { Page, Locator } from '@playwright/test'

export class SearchPage {
    private readonly page: Page;
    private readonly firstNamePlaceholder: Locator;
    private readonly searchButton: Locator;
    private readonly tableRow: Locator;

    constructor(page: Page) {
        this.page = page;
        this.firstNamePlaceholder = page.getByPlaceholder("Enter first name...");
        this.searchButton = page.getByRole("button", {name: "Search", exact: true})
        this.tableRow = page.locator('table > tbody > tr');
    }

    async inputFirstName(firstName: string) {
        //await this.page.waitForLoadState('networkidle');
        await this.firstNamePlaceholder.fill(firstName);

        //return this.page;
    }

    async clickSearchButton() {
      //  await this.searchButton.isEnabled({ timeout: 1000 });
      //    await this.searchButton.click();
        await Promise.all([
            this.page.waitForResponse(resp => resp.url().includes('/api/users') && resp.status() === 200),
            this.searchButton.click()
        ]);
        //return this.page;
    }

    async getTbodyRowCounts() {
       // await this.page.waitForTimeout(2000);
        return await this.tableRow.count();
    }

}