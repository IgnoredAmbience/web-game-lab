DROP TABLE Players;
DROP TABLE Items;
DROP TABLE PlayerLoot;
DROP TABLE Tile;
DROP TABLE Shop;
DROP TABLE ShopStock;

CREATE TYPE ItemClass AS ENUM ('Weapon');

CREATE TABLE Players (
  X integer,
  Y integer,
  Name varchar(20),
  Playing boolean,
  Health integer,
  Wealth integer,
  Stealth integer, -- like threat?
  PlayerId integer SERIAL PRIMARY KEY,
  Shelf varchar(30) REFERENCES items ,
);

CREATE TABLE Items (
  Name  varchar(30) ,
  Value integer     ,
  Class ItemClass   ,
  Stat  integer     ,
  ItemId integer    SERIAL PRIMARY KEY,
);

CREATE TABLE Playerloot (
  PlayerID integer REFERENCES Players,
  ItemID   integer REFERENCES Items,
  Count integer,
  PRIMARY KEY (PlayerID, ItemID)
);

CREATE TABLE Tiles (
  X integer,
  Y integer,
);

CREATE TABLE Shop (
  Name varchar(20),
) INHERITS (Tiles);

CREATE TABLE ShopStock (
  X integer REFERENCES shop,
  Y integer REFERENCES shop,
  ItemId integer REFERENCES items,
  Count integer,
  PRIMARY KEY (X, Y, ItemID)
);
