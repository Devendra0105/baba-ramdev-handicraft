insert into public.categories(slug,name,description,sort_order) values
 ('talwars','Talwars','Talwar-inspired heritage collectibles with decorated hilts and velvet scabbards.',1),
 ('wall-displays','Wall Shields & Display Sets','Mounted shields and display pieces for walls and halls.',2),
 ('swords-replicas','Swords & Replicas','Decorative swords and replicas in different traditions.',3),
 ('handicrafts','Handicrafts','Decorative artifacts and traditional handicrafts.',4),
 ('toys','Toys','Cork-gun-style toys and lawful play items.',5);

with c as (select id, slug from public.categories)
insert into public.products(slug,name,category_id,description,status,inquiry_eligible,featured) values
 ('silver-finish-talwar-pair','Silver-Finish Talwar Pair',(select id from c where slug='talwars'),'Two talwars with engraved silver-finish hilts and red velvet scabbards, as shown in the photo.','draft',true,true),
 ('red-velvet-wall-shield','Red Velvet Wall Shield with Crossed Swords',(select id from c where slug='wall-displays'),'A red velvet wall shield with an ornamental emblem and crossed decorative swords.','draft',true,true),
 ('velvet-scabbard-talwar-set','Velvet Scabbard Talwars',(select id from c where slug='talwars'),'Talwars with maroon velvet scabbards, silver-finish fittings and tassels.','draft',true,true),
 ('lion-head-axe-display','Lion-Head Twin Axe Wall Display',(select id from c where slug='wall-displays'),'A black wall plaque with a lion-head emblem and two mounted decorative axes.','draft',true,false),
 ('silver-finish-straight-sword','Silver-Finish Straight Sword',(select id from c where slug='swords-replicas'),'A straight decorative sword with an ornate silver-finish hilt and matching scabbard.','draft',true,false),
 ('brass-hilt-swords','Brass-Hilt Swords with Dark Scabbards',(select id from c where slug='swords-replicas'),'Decorative swords with polished brass-tone hilts and dark scabbards.','draft',true,false),
 ('katana-style-presentation-box','Katana-Style Sword in Presentation Box',(select id from c where slug='swords-replicas'),'A katana-style decorative sword with red scabbard, presented in a lined box.','draft',true,true),
 ('curved-sword-black-red-scabbards','Curved Sword with Black and Red Scabbards',(select id from c where slug='talwars'),'A curved decorative blade shown with black and red velvet scabbards with ornate fittings.','draft',true,true);

insert into public.product_images(product_id, storage_path, url, alt, sort_order)
select p.id, v.path, v.path, p.name, v.ord from (values
 ('silver-finish-talwar-pair','seed/photo-0.webp',0),
 ('red-velvet-wall-shield','seed/photo-1.webp',0),
 ('red-velvet-wall-shield','seed/photo-2.webp',1),
 ('velvet-scabbard-talwar-set','seed/photo-3.webp',0),
 ('lion-head-axe-display','seed/photo-4.webp',0),
 ('silver-finish-straight-sword','seed/photo-5.webp',0),
 ('brass-hilt-swords','seed/photo-6.webp',0),
 ('katana-style-presentation-box','seed/photo-7.webp',0),
 ('curved-sword-black-red-scabbards','seed/photo-8.webp',0)
) v(slug,path,ord) join public.products p on p.slug=v.slug;