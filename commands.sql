CREATE TABLE blogs(
id SERIAL PRIMARY KEY,
author TEXT,
url TEXT NOT NULL,
title TEXT NOT NULL,
likes INTEGER DEFAULT 0
);

-- 

INSERT INTO blogs (author, url, title) valueVALUES ('Kamil', 'https://www.google.com', 'Google');
INSERT INTO blogs (author, url, title) VALUES ('Klara', 'https://www.bing.com', 'Bing');
INSERT INTO blogs (author, url, title) VALUES ('Leia', 'https://www.pepper.pl', 'Pepper');

