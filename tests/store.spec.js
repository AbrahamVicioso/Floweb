import {test,expect} from '@playwright/test';
test('catalog, favorites, persistent cart and demo checkout',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');
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
 await page.getByPlaceholder('Busca rosas, orquídeas, un bonito gesto…').fill('medianoche');
 await expect(page.locator('.product')).toHaveCount(1);
 await page.getByRole('button',{name:'Cerrar búsqueda'}).click();
 await page.getByRole('button',{name:'Abrir bolsa, 2 productos'}).click();
 await page.getByRole('button',{name:'Continuar con mi selección'}).click();
 await page.getByLabel('Tu nombre',{exact:true}).fill('Cliente de prueba');
 await page.getByLabel('Correo electrónico',{exact:true}).fill('test@example.com');
 await page.getByLabel('Dirección de entrega').fill('Dirección de prueba');
 await page.getByLabel('Fecha deseada').fill('2027-01-20');
 await page.getByRole('button',{name:'Revisar pedido de muestra'}).click();
 await expect(page.getByRole('dialog')).toContainText('No se ha enviado ni cobrado');
 await page.keyboard.press('Escape');
 await expect(page.getByRole('dialog')).toHaveCount(0);
 expect(errors).toEqual([]);
});
test('responsive images and visual captures',async({page})=>{
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
  await page.setViewportSize({width,height});await page.goto('/');
  await page.evaluate(()=>document.fonts.ready);await page.locator('footer').scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>[...document.images].every(i=>i.complete&&i.naturalWidth>0));
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(600);
  await page.screenshot({path:`.playwright/${name}.png`,fullPage:true});
 }
 await page.emulateMedia({reducedMotion:'reduce'});
 await expect(page.locator('.statement-line')).toHaveCSS('animation-name','none');
});
