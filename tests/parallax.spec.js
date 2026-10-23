import {test,expect} from '@playwright/test';

for(const [device,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
 test(`scroll parallax moves and returns across all sections on ${device}`,async({page})=>{
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.setViewportSize({width,height});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  await expect(page.locator('.site-opening')).toHaveCount(0);
  // Sample arbitrary offsets independently of the browser's magnetic settling.
  await page.addStyleTag({content:'html{scroll-behavior:auto!important;scroll-snap-type:none!important}'});
  await page.mouse.move(0,0);
  const translation=selector=>page.locator(selector).first().evaluate(el=>{
   const transform=getComputedStyle(el).transform;
   return transform==='none'?0:new DOMMatrixReadOnly(transform).m42;
  });
  const scroll=top=>page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),top);
  const selectors=['.hero-image','.hero-content','.hero-floral-layer'];
  await scroll(0);
  for(const selector of selectors)await expect.poll(()=>translation(selector)).toBeCloseTo(0,0);
  await scroll(300);
  for(const selector of selectors)await expect.poll(()=>translation(selector)).toBeGreaterThan(10);
  const flowerY=await translation('.hero-floral-layer');
  expect(flowerY).toBeLessThanOrEqual(width<=760?36:80);
  await page.screenshot({path:`.playwright/parallax-${device}.png`});
  await scroll(0);
  for(const selector of selectors)await expect.poll(()=>translation(selector)).toBeCloseTo(0,0);

  for(const [section,visual] of [['.story','.story-photo img'],['.botanical-scene','.botanical-scene__visual'],['.occasion','.occasion img']]){
   const top=await page.locator(section).first().evaluate(el=>el.getBoundingClientRect().top+scrollY);
   await scroll(top-height*.45);
   // Allow the existing interpolation/transition to settle before comparing scroll positions.
   await page.waitForTimeout(900);
   const before=await translation(visual);
   await scroll(top-height*.45+180);
   await expect.poll(async()=>Math.abs(await translation(visual)-before)).toBeGreaterThan(2);
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.emulateMedia({reducedMotion:'no-preference'});
  await scroll(300);
  for(const selector of selectors)await expect.poll(()=>translation(selector)).toBeGreaterThan(10);
  expect(errors).toEqual([]);
 });
}
