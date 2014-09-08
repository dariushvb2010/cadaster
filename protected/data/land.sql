alter table morteza2 
add "plateCode" character varying(50),
add  "waterType" character varying(50),
add  "villageCode" integer,
add  "plantType" character varying(128),
add  "sheetNo" character varying(50),
add  price numeric,
add  "userId" integer,
add  "position" character varying(128) NOT NULL DEFAULT ''::character varying,
add  "numAdjacent" integer,
add  "usingType" character varying(50),
add  "docStatus" character varying(50),
add  CONSTRAINT "land2_userId_fkey" FOREIGN KEY ("userId")
      REFERENCES my_user (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
add  CONSTRAINT "land2_PlateCode_key" UNIQUE ("plateCode")