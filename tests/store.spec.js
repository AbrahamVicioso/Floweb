import {test,expect} from '@playwright/test';

test('three bouquet cards appear on every visit and reload',async({page})=>{
 await page.goto('/',{waitUntil:'domcontentloaded'});
 const opening=page.getByRole('region',{name:'Bienvenida a Alhelí'});
 await expect(opening).toBeVisible();
 await expect(opening.locator('.opening-photo img')).toHaveCount(3);
 await expect(opening.locator('.opening-garden')).toHaveCount(2);
 await expect(opening).toHaveCount(0,{timeout:6500});
 await expect(page.getByRole('heading',{name:/Hay cosas/})).toBeVisible();
 await page.reload({waitUntil:'domcontentloaded'});
 await expect(opening).toBeVisible();
 await page.keyboard.press('Escape');
 await expect(opening).toHaveCount(0);
 await expect(page.locator('body')).not.toHaveCSS('overflow','hidden');
});

test('opening supports skip, reduced motion and deep links',async({page})=>{
 await page.goto('/',{waitUntil:'domcontentloaded'});
 await page.getByRole('button',{name:/Omitir introducci/}).click();
 await expect(page.locator('.site-opening')).toHaveCount(0);
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.reload({waitUntil:'domcontentloaded'});
 await expect(page.locator('.site-opening')).toBeVisible();
 await expect(page.locator('.site-opening')).toHaveCount(0,{timeout:6500});
 await page.goto('/#coleccion',{waitUntil:'domcontentloaded'});
 await expect(page.locator('.site-opening')).toHaveCount(0,{timeout:6500});
 await expect(page.locator('#coleccion')).toBeInViewport();
});

test('opening dismisses gracefully if its photographs fail',async({page})=>{
 await page.route('**/images/bouquet-sunflower.webp',route=>route.abort());
 await page.goto('/');
 await expect(page.locator('.site-opening')).toHaveCount(0,{timeout:2500});
 await expect(page.getByRole('heading',{name:/Hay cosas/})).toBeVisible();
});
test('editorial scene uses responsive photographs and native motion without video',async({page})=>{
 const videoRequests=[];
 page.on('request',request=>{if(/\.(mp4|webm)(\?|$)/.test(request.url()))videoRequests.push(request.url())});
 await page.setViewportSize({width:1440,height:1000});await page.goto('/');await expect(page.locator('.site-opening')).toHaveCount(0);
 await expect(page.locator('video')).toHaveCount(0);
 const scene=page.locator('.botanical-scene'),photo=scene.locator('img');
 await scene.scrollIntoViewIfNeeded();
 await expect.poll(()=>photo.evaluate(el=>el.complete&&el.naturalWidth>0)).toBe(true);
 await expect.poll(()=>photo.evaluate(el=>el.currentSrc)).toContain('botanical-editorial-desktop.webp');
 const before=await scene.locator('picture').evaluate(el=>getComputedStyle(el).transform);
 const bounds=await scene.boundingBox();await page.mouse.move(bounds.x+bounds.width*.85,bounds.y+bounds.height*.45);
 await expect.poll(()=>scene.locator('picture').evaluate(el=>getComputedStyle(el).transform)).not.toBe(before);
 await page.setViewportSize({width:390,height:844});
 await expect.poll(()=>photo.evaluate(el=>el.currentSrc)).toContain('botanical-editorial-mobile.webp');
 await page.emulateMedia({reducedMotion:'reduce'});
 await expect(scene.locator('picture')).toHaveCSS('transform','none');
 expect(videoRequests).toEqual([]);
});
test('catalog has eight distinct bouquets and sunflower search',async({page})=>{
 await page.goto('/');await expect(page.locator('.site-opening')).toHaveCount(0);
 await expect(page.locator('.product')).toHaveCount(8);
 const images=await page.locator('.product-view img').evaluateAll(els=>els.map(el=>el.getAttribute('src')));
 expect(new Set(images).size).toBe(8);
 await expect(page.locator('.product').filter({hasText:'Días de sol'})).toContainText('Girasoles');
 await page.getByRole('button',{name:'Buscar flores',exact:true}).click();
 await page.getByRole('textbox',{name:'Buscar en la colección'}).fill('girasoles');
 await expect(page.locator('.product')).toHaveCount(1);
 await expect(page.locator('.product h3')).toHaveText('Días de sol');
});
test('polished layouts, touch targets and mobile favorites',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const width of [360,390,768,1024,1366,1920]){
  await page.setViewportSize({width,height:900});await page.goto('/',{waitUntil:'domcontentloaded'});await page.getByRole('button',{name:/Omitir introducci/}).click();await expect(page.locator('.site-opening')).toHaveCount(0);
  await expect(page.locator('canvas,.botanical-study')).toHaveCount(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  const sizes=await page.locator('.like,.quick-add,.filters button').evaluateAll(els=>els.map(e=>e.getBoundingClientRect().height));
  expect(sizes.every(height=>height>=44)).toBeTruthy();
  if(width<=1100){const columns=await page.locator('.product-grid').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length);expect(columns).toBe(2)}
 }
 await page.setViewportSize({width:390,height:844});await page.goto('/',{waitUntil:'domcontentloaded'});await page.getByRole('button',{name:/Omitir introducci/}).click();await expect(page.locator('.site-opening')).toHaveCount(0);
 await page.getByRole('button',{name:'Abrir menú',exact:true}).click();
 await expect(page.getByRole('navigation',{name:'Navegación móvil'})).toBeVisible();
 await page.getByRole('button',{name:'Tus favoritos',exact:true}).click();
 await expect(page.locator('.empty')).toBeVisible();
 await expect(page.getByRole('navigation',{name:'Navegación móvil'})).toHaveCount(0);
 await page.getByRole('button',{name:'Abrir menú',exact:true}).click();
 await page.keyboard.press('Escape');
 await expect(page.getByRole('navigation',{name:'Navegación móvil'})).toHaveCount(0);
 expect(errors).toEqual([]);
});
test('foreground flowers cross sections with independent parallax and respect reduced motion',async({page})=>{
 await page.goto('/');await expect(page.locator('.site-opening')).toHaveCount(0);
 const flower=page.locator('.hero-floral-layer');
 await expect(flower.locator('img')).toBeVisible();
 await expect(flower.locator('img')).toHaveJSProperty('complete',true);
 const start=await flower.evaluate(el=>getComputedStyle(el).transform);
 await page.evaluate(()=>scrollTo({top:550,behavior:'instant'}));
 await expect.poll(()=>flower.evaluate(el=>getComputedStyle(el).transform)).not.toBe(start);
 const bounds=await page.evaluate(()=>({flower:document.querySelector('.hero-floral-layer').getBoundingClientRect().bottom,hero:document.querySelector('.hero').getBoundingClientRect().bottom}));
 expect(bounds.flower).toBeGreaterThan(bounds.hero);
 await page.emulateMedia({reducedMotion:'reduce'});
 await expect(flower).toHaveCSS('transform','none');
 await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
 await expect(flower).toHaveCSS('transform','none');
});
test('catalog, favorites, persistent cart and WhatsApp purchase',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await expect(page.locator('.site-opening')).toHaveCount(0);
 await expect(page.getByRole('heading',{name:/Hay cosas/})).toBeVisible();
 await page.getByRole('button',{name:'Añadir Un poco de poesía a la bolsa',exact:true}).click();
 await page.getByRole('button',{name:'Abrir bolsa, 1 productos'}).click();
 await expect(page.getByRole('dialog')).toContainText('Un poco de poesía');
 await page.getByRole('button',{name:'Añadir una unidad de Un poco de poesía'}).click();
 await page.getByRole('button',{name:'Cerrar bolsa'}).click();await page.reload();
 await expect(page.getByRole('button',{name:'Abrir bolsa, 2 productos'})).toBeVisible();
 await page.getByRole('button',{name:'Guardar Un poco de poesía en favoritos',exact:true}).click();
 await page.getByRole('button',{name:'Ver favoritos',exact:true}).click();
 await expect(page.locator('.product')).toHaveCount(1);
 await page.getByRole('button',{name:'Tus favoritos'}).click();
 await page.getByRole('button',{name:'Buscar flores'}).click();
 await page.getByPlaceholder('Busca rosas, girasoles, tulipanes…').fill('medianoche');
 await expect(page.locator('.product')).toHaveCount(1);
 await page.getByRole('button',{name:'Cerrar búsqueda'}).click();
 await page.getByRole('button',{name:'Abrir bolsa, 2 productos'}).click();
 const purchase=page.getByRole('link',{name:'Comprar por WhatsApp'});
 const url=new URL(await purchase.getAttribute('href'));
 expect(url.origin+url.pathname).toBe('https://wa.me/18097856114');
 const message=url.searchParams.get('text');
 expect(message).toContain('Un poco de poesía');
 expect(message).toContain('Rosas rosadas, hortensias y eucalipto');
 expect(message).toContain('Cantidad: 2');
 expect(message).toContain('Precio por unidad:');
 expect(message).toContain('3,200');
 expect(message).toContain('6,400');
 expect(message).toContain('Total de productos:');
 await expect(page.locator('.checkout-form')).toHaveCount(0);
 await page.context().route('https://wa.me/**',route=>route.fulfill({body:'WhatsApp handoff verified'}));
 const popupPromise=page.waitForEvent('popup');
 await purchase.click();
 const popup=await popupPromise;
 await popup.waitForLoadState();
 expect(popup.url()).toBe(url.href);
 await popup.close();
 await page.keyboard.press('Escape');
 await expect(page.getByRole('dialog')).toHaveCount(0);
 expect(errors).toEqual([]);
});
test('responsive images and visual captures',async({page})=>{
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
  await page.setViewportSize({width,height});await page.goto('/');await expect(page.locator('.site-opening')).toHaveCount(0);
  await page.evaluate(()=>document.fonts.ready);
  for(const selector of ['.product-grid','.story','.occasion-grid','footer'])await page.locator(selector).scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>[...document.images].every(i=>i.complete&&i.naturalWidth>0));
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(600);
  await page.screenshot({path:`.playwright/${name}.png`,fullPage:true});
 }
 await page.emulateMedia({reducedMotion:'reduce'});
 await expect(page.locator('.statement-line')).toHaveCSS('animation-name','none');
});
