import {test as base} from "@playwright/test";
import * as preconditions from "@preconditions/preconditions";
import * as usersData from "@data/users.data";
import {step, owner, link} from "allure-js-commons";

type MyFixtures = {
    forEachTest: void;
    createDB: void;
}

export const test = base.extend<MyFixtures>({
    forEachTest: [async ({page}, use) => {
        {
            await owner('kgold2018');
            await link('https://github.com/kgold2018/PlaywrightTypescriptUserAppTest');
            await link('https://github.com/kgold2018/JSNodeExpressAPIProject');
            await link('https://jsnodeexpressapiproject.onrender.com');
        }
        await step('Navigate to the Home Page.', async () => {
            await page.goto('/');
        })
        await use();
    }, {auto: true, title: "Precondition: Open Base Url."}
    ],

    createDB: [async ({request}, use) => {
        await step('Delete DB if exists and Create new users DB.', async () => {
            await preconditions.deleteUsers(request);
            await preconditions.createUsers(request, usersData.users);
        });
        await use();
        await step('Post-condition: Dispose request.', async () => {
            await request.dispose();
        });
    }, {auto: false, scope: "test"}],
});

export { expect } from '@playwright/test';

export async function allureMeta(epic?: any, story?: any, tags?: any, Severity?: any,  description?: any) {
    return await Promise.all([
        epic, story, tags, Severity, description
    ])
}