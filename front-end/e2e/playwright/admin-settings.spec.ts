import { expect, Page, test } from '@playwright/test';

async function signIn(page: Page, username = 'dev_admin') {
  await page.goto('/signin');
  await page.getByLabel('用户名/邮箱').fill(username);
  await page.getByLabel('密码', { exact: true }).fill('devpass');
  await Promise.all([
    page.waitForEvent('load'),
    page.getByRole('button', { name: '登录', exact: true }).click(),
  ]);
  await expect(page).toHaveURL(/\/categories\/1$/);
  await expect(page.getByRole('button', { name: username, exact: true })).toBeVisible();
}

async function settings(page: Page) {
  await page.goto('/admin-message-board');
  await page.getByRole('button', { name: '站点设置', exact: true }).click();
  const toggle = page.getByRole('switch', { name: 'Package 自动审核' });
  await expect(toggle).toBeEnabled();
  return toggle;
}

test('admin can persist the auto approval setting and keep settings separate from telemetry', async ({ page }) => {
  await signIn(page);
  const toggle = await settings(page);
  const initial = await toggle.getAttribute('aria-checked');
  const opposite = initial === 'true' ? 'false' : 'true';
  try {
    await expect(page.getByRole('heading', { name: '界面风格' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '数据概览', exact: true })).toHaveCount(0);
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-checked', opposite);
    await expect(toggle).toBeEnabled();
    const restored = await settings(page);
    await expect(restored).toHaveAttribute('aria-checked', opposite);
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(restored).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.getByRole('button', { name: '运营概览', exact: true }).click();
    await expect(page.getByRole('heading', { name: '数据概览', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: '界面风格' })).toHaveCount(0);
  } finally {
    const current = await settings(page);
    if (await current.getAttribute('aria-checked') !== initial) {
      await current.click();
      await expect(current).toHaveAttribute('aria-checked', initial!);
      await expect(current).toBeEnabled();
    }
  }
});

test('failed save keeps the last saved value and permits retry', async ({ page }) => {
  await signIn(page);
  const toggle = await settings(page);
  const initial = await toggle.getAttribute('aria-checked');
  await page.route('**/san11_platform.San11Platform/UpdateSiteSettings', route => route.abort());
  await toggle.click();
  await expect(page.getByRole('alert')).toContainText('保存失败');
  await expect(toggle).toHaveAttribute('aria-checked', initial!);
  await expect(toggle).toBeEnabled();
});

test('regular users cannot load or change site settings', async ({ page }) => {
  await signIn(page, 'dev_user');
  await page.goto('/admin-message-board');
  await page.getByRole('button', { name: '站点设置', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('设置加载失败');
  await expect(page.getByRole('switch', { name: 'Package 自动审核' })).toBeDisabled();
});
