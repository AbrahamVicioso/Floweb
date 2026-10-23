import {test,expect} from '@playwright/test';

for(const width of [1440,390]){
 test(`magnetic section settling at ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:900});
  await page.goto('/');
  await expect(page.locator('.site-opening')).toHaveCount(0);
  const target=await page.locator('#coleccion').evaluate(el=>el.getBoundingClientRect().top+scrollY);
  await page.evaluate(y=>scrollTo({top:y-60,behavior:'instant'}),target);
  await expect.poll(()=>page.evaluate(()=>scrollY)).toBeCloseTo(target,0);
  // The middle of the long catalog must stay freely accessible.
  await page.evaluate(y=>scrollTo({top:y+450,behavior:'instant'}),target);
  await expect.poll(()=>page.evaluate(()=>scrollY)).toBeCloseTo(target+450,0);
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(page.locator('html')).toHaveCSS('scroll-snap-type','none');
 });
}
