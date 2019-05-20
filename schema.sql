
create table boards (
  id serial primary key,
  name text,

-- am I going to hate myself for calling it this?
  board_id text  
);

create table pins (
  id serial primary key,
  pin_id text,  
  note text,
  link text,
  img text,
  board_id integer references boards(id)
);

create table tags (
  id serial primary key,
  name text
);

create table tags_pins (
  tag_id integer references tags(id),
  pin_id integer references pins(id)  
  
);

create table tags_boards (
  tag_id integer references tags(id),
  board_id integer references boards(id)
);
