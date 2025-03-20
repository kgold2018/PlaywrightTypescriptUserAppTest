import {test, expect, allureMeta} from "@base/base.test";
import * as usersData from "@data/users.data";
// import {HomePage} from "@pages/home.page";
// import {SearchPage} from "@pages/search.page";
import {step, description, epic, Severity, story, tags} from "allure-js-commons";

test.describe('Should Search Users By Search Criteria', async () => {

    test.beforeEach('Setup Allure meta', async() => {
        await allureMeta(
            epic('FUN: Search User'),
            story('FUN-SEARCH: Search for a User/Users using one or multiple criteria.'),
            tags('FUN', 'SEARCH', 'UniqueFirstName'),
            Severity.NORMAL
        )
    })

    test('Search User With Unique First Name - no POM', async({ createDB, page }) => {
        const userWithUniqueFirstName = usersData.users[0];

        const searchTab = page.getByRole('link', {name: 'Search', exact: true});
        const tableRow = page.locator("tbody>tr");
        const firstNamePlaceholder = page.getByPlaceholder('Enter first name...');
        const searchButton = page.getByRole('button', {name: 'Search', exact: true});

        await expect(searchTab).toBeEnabled();
        await searchTab.hover();
        await searchTab.click();

        await expect(tableRow.first()).toBeAttached();
        await expect(searchButton).toBeDisabled();
        await expect(firstNamePlaceholder).toBeVisible();

        await firstNamePlaceholder.fill(userWithUniqueFirstName.firstName);

        await expect (searchButton).toBeEnabled();
        await searchButton.click();

        await expect(tableRow).toHaveCount(1);

        await tableRow.first().hover();
        await expect(tableRow.first()).toBeVisible();

        const actualUserInfo = await tableRow.first().innerText().then(text => text.split("\t"));

        expect(actualUserInfo[1]).toStrictEqual(userWithUniqueFirstName.firstName);
        expect(actualUserInfo[2]).toStrictEqual(userWithUniqueFirstName.lastName);
        expect(actualUserInfo[3]).toStrictEqual(userWithUniqueFirstName.age.toString());
    })

    test('Search User With Unique First Name - POM v2', async({createDB, homePage, searchPage }) => {
        await allureMeta(
            description('This test verifies that the "Search" tab is accessible, allows user input, ' +
                'enables the search button upon valid input, and correctly displays the searched user’s details ' +
                'in the results table.')
        )
        const userWithUniqueFirstName = usersData.uniqueFirstNameUser;
        const expectedFirstName = userWithUniqueFirstName.firstName;
        const expectedLastName = userWithUniqueFirstName.lastName;
        const expectedAge = userWithUniqueFirstName.age.toString();
        let actualUserInfo: string[] = [];

        await step('1. Click "Search" tab on the Home page', async () => {
            await homePage.tab.clickSearchTab();
        });

        await step(`2. Input "${userWithUniqueFirstName.firstName}" into the "First Name" field.`, async () => {
            await searchPage.form.inputFirstName(userWithUniqueFirstName.firstName);
        });

        await step('3. Click "Search" button when enabled', async () => {
            await searchPage.form.clickSearchButton();
        });

        await step('Expect: The number of users displayed in search result is 1.', async () => {
            await expect(searchPage.table.tableRow).toHaveCount(1);
        })

        await step('Collect Actual User Info: Collect user info from the single search result.', async() => {
            actualUserInfo = await searchPage.table.getFirstRowResultInfo();        });


        await step(`Expect: Actual first name '${actualUserInfo[1]}' in the search result matches the expected first name "${expectedFirstName}".`, async () => {
            expect(actualUserInfo[1]).toStrictEqual(expectedFirstName);
        });

        await step(`Expect: Actual last name "${actualUserInfo[2]}" in the search result matches the expected last name "${expectedLastName}".`, async () => {
            expect(actualUserInfo[2]).toStrictEqual(expectedLastName);
        });

        await step(`Expect: Actual age "${actualUserInfo[3]}" in the search result matches the expected age "${expectedAge}".`, async () => {
            expect(actualUserInfo[3]).toStrictEqual(expectedAge);
        });
    })

})


// test.beforeEach('Create API Request Context, Create Preconditions', async({ page }) => {
//     apiRequest = await request.newContext();
//     await preconditions.deleteUsers(apiRequest);
//     await preconditions.createUsers(apiRequest);
//
//     await page.goto('/');
// })

// test('Search User With Unique First Name', async({ page }) => {
//     const userJohn = users[0];
//     await new HomePage(page).clickSearchTab();
//
//     const searchPage = new SearchPage(page);
//     await searchPage.inputFirstName(userJohn.firstName);
//     await searchPage.clickSearchButton();
//
//     expect(await searchPage.getTbodyRowCounts()).toBe(1);
// })