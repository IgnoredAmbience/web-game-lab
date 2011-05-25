DROP TABLE IF EXISTS Items	CASCADE;
DROP TABLE IF EXISTS Players	CASCADE;
DROP TABLE IF EXISTS PlayerLoot CASCADE;
DROP TABLE IF EXISTS Tiles	CASCADE;
DROP TABLE IF EXISTS Shop	CASCADE;
DROP TABLE IF EXISTS ShopStock  CASCADE;

DROP TYPE  IF EXISTS ItemClass  CASCADE;

CREATE TYPE ItemClass AS ENUM ('Weapon');

CREATE TABLE Items (
  Name  varchar(30) ,
  Value integer     ,
  Class ItemClass   ,
  Stat  integer     ,
  ItemId serial,
  PRIMARY KEY (ItemId)
);

CREATE TABLE Players (
  X integer,
  Y integer,
  Name varchar(20),
  Playing boolean,
  Health integer,
  Wealth integer,
  Stealth integer, -- like threat?
  PlayerId serial,
  Shelf integer REFERENCES Items(ItemId),
  PRIMARY KEY (PlayerId)
);

CREATE TABLE PlayerLoot (
  PlayerID integer REFERENCES Players,
  ItemID   integer REFERENCES Items,
  Count integer,
  PRIMARY KEY (PlayerID, ItemID)
);

CREATE TABLE Tiles (
  X integer,
  Y integer,
  PRIMARY KEY (X,Y)
);

CREATE TABLE Shop (
  Name varchar(20),
  PRIMARY KEY (X,Y) -- primary key contraint not inherited from tiles
) INHERITS (Tiles);

CREATE TABLE ShopStock (
  X integer ,
  Y integer ,
  ItemId integer REFERENCES Items,
  Count integer,
  FOREIGN KEY(X,Y) REFERENCES Shop(X,Y)
);
