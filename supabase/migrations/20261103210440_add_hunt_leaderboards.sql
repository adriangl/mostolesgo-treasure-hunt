create table public.hunts (
  id text primary key,
  name text not null
);

create table public.hunt_missions (
  hunt_id text not null references public.hunts (id) on delete cascade,
  day_id text not null,
  mission_id text not null,
  points integer not null check (points >= 0),
  primary key (hunt_id, day_id, mission_id)
);

create table public.hunt_players (
  hunt_id text not null references public.hunts (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  nickname text not null check (
    nickname = btrim(nickname)
    and char_length(nickname) between 2 and 24
    and nickname !~ '[[:cntrl:]]'
  ),
  primary key (hunt_id, user_id)
);

create unique index hunt_players_unique_nickname
  on public.hunt_players (hunt_id, lower(nickname));
create index hunt_players_user_id_idx on public.hunt_players (user_id);

create table public.completed_missions (
  hunt_id text not null,
  user_id uuid not null,
  day_id text not null,
  mission_id text not null,
  primary key (hunt_id, user_id, day_id, mission_id),
  foreign key (hunt_id, user_id)
    references public.hunt_players (hunt_id, user_id) on delete cascade,
  foreign key (hunt_id, day_id, mission_id)
    references public.hunt_missions (hunt_id, day_id, mission_id) on delete cascade
);

create index completed_missions_day_idx
  on public.completed_missions (hunt_id, day_id, user_id);
create index completed_missions_mission_idx
  on public.completed_missions (hunt_id, day_id, mission_id);

alter table public.hunts enable row level security;
alter table public.hunt_missions enable row level security;
alter table public.hunt_players enable row level security;
alter table public.completed_missions enable row level security;

revoke all on public.hunts, public.hunt_missions, public.hunt_players,
  public.completed_missions from anon, authenticated;
grant select, insert on public.hunt_players to authenticated;
grant select, insert, delete on public.completed_missions to authenticated;

create policy "Players read their own registration"
  on public.hunt_players for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Players register themselves"
  on public.hunt_players for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Players read their own completions"
  on public.completed_missions for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Players add their own completions"
  on public.completed_missions for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "Players remove their own completions"
  on public.completed_missions for delete to authenticated
  using ((select auth.uid()) = user_id);

-- Keep the privileged aggregation outside the schemas exposed by the Data API.
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

create function private.day_leaderboard(p_hunt_id text, p_day_id text)
returns table (name text, points integer)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select auth.uid()) is null or not exists (
    select 1 from public.hunt_players p
    where p.hunt_id = p_hunt_id and p.user_id = (select auth.uid())
  ) then
    raise exception 'Register for this hunt first' using errcode = '42501';
  end if;

  if not exists (
    select 1 from public.hunt_missions m
    where m.hunt_id = p_hunt_id and m.day_id = p_day_id
  ) then
    raise exception 'Unknown hunt day' using errcode = '22023';
  end if;

  return query
    select p.nickname as name, coalesce(sum(m.points), 0)::integer as points
    from public.hunt_players p
    left join public.completed_missions c
      on c.hunt_id = p.hunt_id and c.user_id = p.user_id and c.day_id = p_day_id
    left join public.hunt_missions m
      on m.hunt_id = c.hunt_id and m.day_id = c.day_id and m.mission_id = c.mission_id
    where p.hunt_id = p_hunt_id
    group by p.user_id, p.nickname
    order by 2 desc, lower(p.nickname), p.nickname;
end;
$$;

revoke all on function private.day_leaderboard(text, text) from public, anon, authenticated;
grant execute on function private.day_leaderboard(text, text) to authenticated;

create function public.get_day_leaderboard(p_hunt_id text, p_day_id text)
returns table (name text, points integer)
language sql
security invoker
set search_path = ''
as $$
  select * from private.day_leaderboard(p_hunt_id, p_day_id);
$$;

revoke all on function public.get_day_leaderboard(text, text) from public, anon;
grant execute on function public.get_day_leaderboard(text, text) to authenticated;

insert into public.hunts (id, name) values
  ('mostoles-go-area-silvestre-2026', 'Caza de Recompensas');

insert into public.hunt_missions (hunt_id, day_id, mission_id, points) values
  ('mostoles-go-area-silvestre-2026', 'sabado-14', 'check-in', 2),
  ('mostoles-go-area-silvestre-2026', 'sabado-14', 'coleccionista-generaciones', 4),
  ('mostoles-go-area-silvestre-2026', 'sabado-14', 'cazador-formidables', 6),
  ('mostoles-go-area-silvestre-2026', 'sabado-14', 'gigante-inesperado', 5),
  ('mostoles-go-area-silvestre-2026', 'sabado-14', 'elegancia-combate', 4),
  ('mostoles-go-area-silvestre-2026', 'sabado-14', 'leyendas-ideales', 4),
  ('mostoles-go-area-silvestre-2026', 'sabado-14', 'senor-tiempo', 5),
  ('mostoles-go-area-silvestre-2026', 'sabado-14', 'gigante-acero', 4),
  ('mostoles-go-area-silvestre-2026', 'sabado-14', 'recuerdo-especial', 7),
  ('mostoles-go-area-silvestre-2026', 'sabado-14', 'premio-gordo', 9),
  ('mostoles-go-area-silvestre-2026', 'domingo-15', 'check-in', 2),
  ('mostoles-go-area-silvestre-2026', 'domingo-15', 'mosaico-elemental', 5),
  ('mostoles-go-area-silvestre-2026', 'domingo-15', 'coleccionista-generaciones', 3),
  ('mostoles-go-area-silvestre-2026', 'domingo-15', 'cazador-formidables', 6),
  ('mostoles-go-area-silvestre-2026', 'domingo-15', 'gigante-inesperado', 5),
  ('mostoles-go-area-silvestre-2026', 'domingo-15', 'leyendas-verdad', 4),
  ('mostoles-go-area-silvestre-2026', 'domingo-15', 'senor-espacio', 5),
  ('mostoles-go-area-silvestre-2026', 'domingo-15', 'gigante-acero', 4),
  ('mostoles-go-area-silvestre-2026', 'domingo-15', 'recuerdo-especial', 7),
  ('mostoles-go-area-silvestre-2026', 'domingo-15', 'premio-gordo', 9);
