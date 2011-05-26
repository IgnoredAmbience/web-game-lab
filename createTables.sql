DROP TABLE IF EXISTS Item	CASCADE;
DROP TABLE IF EXISTS Player	CASCADE;
DROP TABLE IF EXISTS PlayerLoot CASCADE;
DROP TABLE IF EXISTS Tile	CASCADE;
DROP TABLE IF EXISTS Shop	CASCADE;
DROP TABLE IF EXISTS ShopStock  CASCADE;

DROP TYPE  IF EXISTS ItemClass  CASCADE;

CREATE TYPE ItemClass AS ENUM ('Weapon');

CREATE TABLE Item (
  name  varchar(30) ,
  value integer     ,
  class ItemClass   ,
  stat  integer     ,
  itemId serial,
  PRIMARY KEY (itemId)
);

CREATE TABLE Player (
  x integer,
  y integer,
  name varchar(20),
  playing boolean,
  health integer,
  wealth integer,
  stealth integer, -- like threat?
  playerId serial,
  shelf integer REFERENCES Item(itemId),
  PRIMARY KEY (playerId)
);

CREATE TABLE PlayerLoot (
  playerId integer REFERENCES Player,
  itemId   integer REFERENCES Item,
  count integer,
  PRIMARY KEY (playerId, itemId)
);

CREATE TABLE Tile (
  x integer,
  y integer,
  PRIMARY KEY (x,y)
);

CREATE TABLE Shop (
  name varchar(20),
  PRIMARY KEY (x,y) -- primary key contraint not inherited from tile
) INHERITS (Tile);

CREATE TABLE ShopStock (
  x integer ,
  y integer ,
  itemId integer REFERENCES Item,
  count integer,
  FOREIGN KEY(x,y) REFERENCES Shop(x,y)
);
