/* Coverage is positive evidence, not a complete store census. Missing area = unverified,
   never "no store exists". Branch existence does not verify reward participation. */
const locationCoverage={};
function cover(id,areas,url,address=''){for(const area of areas)(locationCoverage[id]??={})[area]={url,address,checked:'2026-10-06'}}
cover('bundt',['Houston','Katy','Cypress','The Woodlands','Humble','Sugar Land','Pearland','Baytown','League City'],'https://www.nothingbundtcakes.com/find-a-bakery/tx/');
cover('sephora',['Houston','Katy','Cypress','The Woodlands','Humble','Sugar Land'],'https://www.sephora.com/happening/storelist');
cover('audit-ulta-beauty',['Houston','Katy','The Woodlands','Humble','Sugar Land','League City'],'https://www.ulta.com/stores/directory');
cover('chuys',['Houston'],'https://www.chuys.com/locations/tx/houston/houston-tx-bunker-hill/6085');
cover('chuys',['Katy'],'https://www.chuys.com/locations/tx/katy/katy-tx/6026');
cover('chuys',['Sugar Land'],'https://www.chuys.com/locations/tx/sugar-land/sugarland-tx/6054');
cover('chuys',['Humble'],'https://www.chuys.com/locations/tx/humble/humble-tx/6011');
cover('tacos',['Houston'],'https://www.tacosagogo.com/locations/','3704 Main St, Houston, TX 77002');
cover('audit-velvet-taco',['Houston'],'https://www.velvettaco.com/location/the-heights/','2001 N Shepherd Drive, Houston, TX 77008');
cover('audit-velvet-taco',['The Woodlands'],'https://www.velvettaco.com/location/the-woodlands/','9120 Gosling Road, The Woodlands, TX 77381');
cover('audit-velvet-taco',['Sugar Land'],'https://www.velvettaco.com/sitemap/');
cover('sephora',['The Woodlands'],'https://www.sephora.com/happening/stores/market-street','9595 Six Pines Dr, Ste 810, The Woodlands, TX 77380');
cover('sephora',['Houston'],'https://www.sephora.com/happening/stores/river-oaks','1987 W Gray St, Houston, TX');
cover('chickfila',['Houston'],'https://www.chick-fil-a.com/locations/tx/45-woodridge','7007 Gulf Fwy, Houston, TX 77087');
cover('chickfila',['The Woodlands'],'https://www.chick-fil-a.com/locations/tx/the-woodlands-mall','1201 Lake Woodlands Dr, Ste 2146, The Woodlands, TX 77380');
cover('bundt',['The Woodlands'],'https://www.nothingbundtcakes.com/find-a-bakery/tx/thewoodlands/bakery-51.html');
cover('chilis',['The Woodlands'],'https://www.chilis.com/locations/us/texas/the-woodlands/woodlands','1110 Lake Woodlands Dr, The Woodlands, TX 77380');
cover('audit-crumbl',['The Woodlands'],'https://crumblcookies.com/stores/tx/txwoodlands','9595 Six Pines Dr, Ste 1075, The Woodlands, TX 77380');
cover('audit-ulta-beauty',['The Woodlands'],'https://www.ulta.com/stores/the-woodlands-tx-1473','1900 Lake Woodlands Dr, Ste 800, The Woodlands, TX 77380');
cover('olivegarden',['Houston'],'https://www.olivegarden.com/locations/tx/houston/houston-gulfgate-center/6485','522 Gulfgate Center Mall, Houston, TX 77087');
cover('audit-torchys-tacos',['The Woodlands'],'https://www.torchystacos.com/woodlands/order','4747 Research Forest Drive, #475, The Woodlands, TX 77381');
cover('audit-torchys-tacos',['Houston'],'https://torchystacos.com/memorial-city/order');
cover('audit-panera',['Houston'],'https://www.panerabread.com/en-us/cafe/locations/tx/houston/8845-w-loop-s','8845 W Loop S, Houston, TX');
cover('audit-dutch-bros',['Houston','Sugar Land'],'https://www.dutchbros.com/locations/');
