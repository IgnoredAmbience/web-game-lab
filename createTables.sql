DROP TABLE IF EXISTS Item	CASCADE;
DROP TABLE IF EXISTS Player	CASCADE;
DROP TABLE IF EXISTS PlayerLoot CASCADE;
DROP TABLE IF EXISTS Tile	CASCADE;
DROP TABLE IF EXISTS Shop	CASCADE;
DROP TABLE IF EXISTS ShopStock  CASCADE;
DROP TABLE IF EXISTS Map        CASCADE;

DROP TYPE  IF EXISTS ItemClass  CASCADE;

CREATE TYPE ItemClass AS ENUM ('Weapon');

CREATE TABLE Item (
  id serial         ,
  name  varchar(30) ,
  value integer     ,
  class ItemClass   ,
  stat  integer     ,
  PRIMARY KEY (id)
);

CREATE TABLE Player (
  id serial,
  x integer,
  y integer,
  mapId integer references map(id),
  name varchar(20),
  playing boolean,
  health integer,
  wealth integer,
  stealth integer, -- like threat?
  shelf integer REFERENCES Item(id),
  PRIMARY KEY (id),
  UNIQUE (name)
);

CREATE TABLE PlayerLoot (
  id serial,
  playerId integer REFERENCES Player(id),
  itemId   integer REFERENCES Item(id),
  count integer,
  PRIMARY KEY (id),
  UNIQUE (playerId, itemId)
);

CREATE TABLE Tile (
  x integer,
  y integer,
  mapId integer references map(id),
  PRIMARY KEY (x,y, mapId)
);

CREATE TABLE Shop (
  id serial,
  name varchar(20),
  PRIMARY KEY (id),
  UNIQUE (x,y, mapId) -- key contraint not inherited from tile
) INHERITS (Tile);

CREATE TABLE ShopStock (
  id serial,
  shopId integer REFERENCES Shop(id),
  itemId integer REFERENCES Item(id),
  count integer,
  PRIMARY KEY (id),
  UNIQUE (shopId, itemId)
);

CREATE TABLE Map (
  id serial,
  width integer,
  height integer,
  name varchar(50),
  PRIMARY KEY (id),
  UNIQUE (name)
);
