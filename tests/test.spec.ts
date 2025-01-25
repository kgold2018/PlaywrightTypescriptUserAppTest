import {test}  from 'playwright/test';
test('Test 1', async({page}) => {
    await page.goto('https://jsnodeexpressapiproject.onrender.com')
});