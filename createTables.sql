DROP TABLE IF EXISTS Items	CASCADE;
DROP TABLE IF EXISTS Players	CASCADE;
DROP TABLE IF EXISTS PlayerLoot CASCADE;
DROP TABLE IF EXISTS Tiles	CASCADE;
DROP TABLE IF EXISTS Shop	CASCADE;
DROP TABLE IF EXISTS ShopStock  CASCADE;

DROP TYPE  IF EXISTS ItemClass  CASCADE;

CREATE TYPE ItemClass AS ENUM ('Weapon');

CREATE TABLE Items (
  name  varchar(30) ,
  value integer     ,
  class ItemClass   ,
  stat  integer     ,
  itemId serial,
  PRIMARY KEY (itemId)
);

CREATE TABLE Players (
  x integer,
  y integer,
  name varchar(20),
  playing boolean,
  health integer,
  wealth integer,
  stealth integer, -- like threat?
  playerId serial,
  shelf integer REFERENCES Items(itemId),
  PRIMARY KEY (playerId)
);

CREATE TABLE PlayerLoot (
  playerId integer REFERENCES Players,
  itemId   integer REFERENCES Items,
  count integer,
  PRIMARY KEY (playerId, itemId)
);

CREATE TABLE Tiles (
  x integer,
  y integer,
  PRIMARY KEY (x,y)
);

CREATE TABLE Shop (
  name varchar(20),
  PRIMARY KEY (x,y) -- primary key contraint not inherited from tiles
) INHERITS (Tiles);

CREATE TABLE ShopStock (
  x integer ,
  y integer ,
  itemId integer REFERENCES Items,
  count integer,
  FOREIGN KEY(x,y) REFERENCES Shop(x,y)
);
