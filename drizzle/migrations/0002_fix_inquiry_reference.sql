CREATE OR REPLACE FUNCTION public.submit_inquiry(_idempotency_key uuid, _name text, _phone text, _email text, _address text, _message text, _items jsonb, _ip_hash text)
 RETURNS TABLE(reference text, duplicate boolean)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  existing text; inq_id uuid; ref text; total numeric(12,2) := 0; has_unpriced boolean := false;
  it jsonb; p record; q int; n int;
begin
  select i.reference into existing from public.inquiries i where i.idempotency_key = _idempotency_key;
  if existing is not null then return query select existing, true; return; end if;

  if (select count(*) from public.inquiries where ip_hash = _ip_hash and created_at > now() - interval '1 hour') >= 5 then
    raise exception 'RATE_LIMIT';
  end if;

  n := jsonb_array_length(_items);
  if n < 1 or n > 20 then raise exception 'INVALID_ITEMS'; end if;

  ref := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 12));
  insert into public.inquiries(reference, idempotency_key, customer_name, phone, email, address, message, ip_hash)
    values (ref, _idempotency_key, _name, _phone, nullif(_email,''), _address, nullif(_message,''), _ip_hash)
    returning id into inq_id;

  for it in select * from jsonb_array_elements(_items) loop
    q := (it->>'quantity')::int;
    select * into p from public.products where id = (it->>'product_id')::uuid for update;
    if p.id is null or p.status <> 'published' or not p.inquiry_eligible then raise exception 'UNAVAILABLE:%', coalesce(p.name, 'item'); end if;
    if q < 1 or q > 50 then raise exception 'INVALID_QTY'; end if;
    if p.stock < q then raise exception 'STOCK:%', p.name; end if;
    insert into public.inquiry_items(inquiry_id, product_id, product_name, product_slug, unit_price, quantity)
      values (inq_id, p.id, p.name, p.slug, p.price, q);
    if p.price is null then has_unpriced := true; else total := total + p.price * q; end if;
  end loop;

  update public.inquiries set estimated_total = case when has_unpriced then null else total end where id = inq_id;
  return query select ref, false;
end $function$;