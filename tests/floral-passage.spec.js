import {test,expect} from '@playwright/test';

for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
 test(`garden stays inside products and enters from above on ${name}`,async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.setViewportSize({width,height});await page.goto('/');
  await expect(page.locator('.site-opening')).toHaveCount(0);
  await page.addStyleTag({content:'html{scroll-snap-type:none!important;scroll-behavior:auto!important}'});
  const garden=page.locator('.floral-passage'),hedge=page.locator('.floral-passage__hedge');
  const corner=page.locator('.floral-passage__corner').first();
  await expect(page.locator('#coleccion > .floral-passage')).toHaveCount(1);
  await expect(garden).toHaveCSS('overflow','hidden');
  await expect(hedge).toHaveCSS('opacity','0');
  await expect(corner).toHaveCSS('opacity','0');
  const top=await page.locator('#coleccion').evaluate(e=>e.getBoundingClientRect().top+scrollY);
  const y=()=>hedge.evaluate(e=>new DOMMatrixReadOnly(getComputedStyle(e).transform).m42);
  expect(await y()).toBe(-240);
  await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),top-height*.3);
  await expect.poll(async()=>Number(await hedge.evaluate(e=>getComputedStyle(e).opacity))).toBeGreaterThan(.4);
  expect(await y()).toBeLessThan(-20);
  await page.screenshot({path:`.playwright/garden-entering-${name}.png`});
  await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),top);
  await expect(hedge).toHaveCSS('opacity','1');
  await expect(corner).toHaveCSS('opacity','1');
  await expect.poll(y).toBe(0);
  const bounds=await page.evaluate(()=>({garden:document.querySelector('.floral-passage').getBoundingClientRect().bottom,heading:document.querySelector('#coleccion h2').getBoundingClientRect().top}));
  expect(bounds.garden).toBeLessThan(bounds.heading);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.screenshot({path:`.playwright/garden-products-${name}.png`});
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
  await expect(hedge).toHaveCSS('opacity','0');await expect(corner).toHaveCSS('opacity','0');
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(hedge).toHaveCSS('opacity','0');
  await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),top);
  await expect(hedge).toHaveCSS('opacity','1');
  await expect.poll(y).toBe(0);
  expect(errors).toEqual([]);
 });
}
