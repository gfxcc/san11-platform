import { expect, Page, test } from '@playwright/test';

const RPC_PREFIX = '/san11_platform.San11Platform/';

type NetworkProbe = {
  rpcStatuses: Record<string, number[]>;
  requestFailures: string[];
  serverErrors: string[];
};

function attachNetworkProbe(page: Page): NetworkProbe {
  const probe: NetworkProbe = {
    rpcStatuses: {},
    requestFailures: [],
    serverErrors: [],
  };

  page.on('requestfailed', request => {
    const url = request.url();
    if (url.includes('localhost') || url.includes(RPC_PREFIX)) {
      probe.requestFailures.push(`${request.method()} ${url} ${request.failure()?.errorText ?? ''}`);
    }
  });

  page.on('response', response => {
    const url = response.url();
    const rpcStart = url.indexOf(RPC_PREFIX);
    if (rpcStart >= 0) {
      const rpcName = url.substring(rpcStart + RPC_PREFIX.length).split(/[?#]/)[0];
      probe.rpcStatuses[rpcName] = probe.rpcStatuses[rpcName] ?? [];
      probe.rpcStatuses[rpcName].push(response.status());
    }
    if (response.status() >= 500) {
      probe.serverErrors.push(`${response.status()} ${url}`);
    }
  });

  return probe;
}

async function expectRpcOk(probe: NetworkProbe, rpcName: string): Promise<void> {
  await expect.poll(() => probe.rpcStatuses[rpcName]?.length ?? 0).toBeGreaterThan(0);
  expect(probe.rpcStatuses[rpcName].every(status => status === 200)).toBe(true);
}

function expectNoTransportFailures(probe: NetworkProbe): void {
  expect(probe.serverErrors).toEqual([]);
  expect(probe.requestFailures).toEqual([]);
}

async function expectCatalogLoaded(page: Page, probe: NetworkProbe): Promise<void> {
  await expect(page.getByText('资源库')).toBeVisible();
  await expect(page.getByText(/\d+\s*项资源/)).toBeVisible();
  await expect.poll(() => page.locator('app-package-card').count()).toBeGreaterThan(0);
  await expectRpcOk(probe, 'ListPackages');
}

test.describe('anonymous critical user journeys', () => {
  test('catalog loads, sorts, and navigates categories through grpc-web', async ({ page }) => {
    const probe = attachNetworkProbe(page);

    await page.goto('/');
    await expectCatalogLoaded(page, probe);

    await page.getByRole('combobox', { name: '排序优先' }).click();
    await page.getByRole('option', { name: '下载量' }).click();
    await expectRpcOk(probe, 'ListPackages');
    await expect(page.getByRole('combobox', { name: '排序优先' })).toContainText('下载量');

    await page.locator('app-sidebar').getByText('修改工具').click();
    await expect(page).toHaveURL(/\/categories\/2/);
    await expectCatalogLoaded(page, probe);

    expectNoTransportFailures(probe);
  });

  test('search runs against the backend and preserves the catalog shell', async ({ page }) => {
    const probe = attachNetworkProbe(page);

    await page.goto('/');
    await expectCatalogLoaded(page, probe);

    await page.getByPlaceholder('搜索工具、MOD 或插件').fill('test');

    await expect(page).toHaveURL(/\/search\?query=test/);
    await expect(page.getByText('资源库')).toBeVisible();
    await expectRpcOk(probe, 'SearchPackages');
    await expect(page.locator('.catalog-page')).toBeVisible();

    expectNoTransportFailures(probe);
  });

  test('package detail opens from catalog and loads versions plus package discussion', async ({ page }) => {
    const probe = attachNetworkProbe(page);

    await page.goto('/');
    await expectCatalogLoaded(page, probe);

    const firstCard = page.locator('app-package-card').first();
    const packageName = (await firstCard.locator('h2').innerText()).trim();
    await firstCard.click();

    await expect(page).toHaveURL(/\/categories\/\d+\/packages\/\d+/);
    await expect(page.getByRole('heading', { name: packageName })).toBeVisible();
    await expect(page.getByText('资源详情')).toBeVisible();
    await expect(page.getByRole('heading', { name: '资源介绍' })).toBeVisible();

    await page.getByRole('button', { name: /查看版本/ }).click();
    await expect(page.getByRole('heading', { name: '版本' })).toBeVisible();
    await expect(page.locator('mat-tab-group.version-tabs')).toBeVisible();
    await expect(page.getByText(/暂无版本|版本|下载量/).first()).toBeVisible();

    await expect(page.getByRole('button', { name: /新帖子/ })).toBeVisible();
    await expectRpcOk(probe, 'GetPackage');
    await expectRpcOk(probe, 'ListBinaries');
    await expectRpcOk(probe, 'ListThreads');

    expectNoTransportFailures(probe);
  });

  test('community pages load discussions and articles from backend routes', async ({ page }) => {
    const probe = attachNetworkProbe(page);

    await page.goto('/discussion');
    await expect(page.getByRole('heading', { name: '综合讨论区' })).toBeVisible();
    await expect(page.getByRole('button', { name: /新帖子/ })).toBeVisible();
    await expect(page.getByText(/暂无讨论|新帖子/).first()).toBeVisible();
    await expectRpcOk(probe, 'ListThreads');

    await page.goto('/articles');
    await expect(page.getByText('社区文章')).toBeVisible();
    await expect(page.getByRole('heading', { name: '攻略、教程与更新' })).toBeVisible();
    await expect(page.getByText(/\d+\s*篇文章|空空如也/)).toBeVisible();
    await expectRpcOk(probe, 'ListArticles');

    expectNoTransportFailures(probe);
  });

  test('anonymous auth and create entry points remain reachable', async ({ page }) => {
    const probe = attachNetworkProbe(page);

    await page.goto('/');
    await expectCatalogLoaded(page, probe);

    await page.getByRole('button', { name: /创建/ }).click();
    await expect(page.getByText('上传工具需要登陆')).toBeVisible();

    await page.getByText('登陆').click();
    await expect(page).toHaveURL(/\/signin/);
    await expect(page.getByRole('button', { name: /登陆/ })).toBeVisible();

    await page.getByText('注册').click();
    await expect(page).toHaveURL(/\/register/);
    await expect(page.getByRole('heading', { name: '注册' })).toBeVisible();

    expectNoTransportFailures(probe);
  });
});
