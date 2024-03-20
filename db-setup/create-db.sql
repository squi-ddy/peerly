create table users (
    id int unsigned auto_increment primary key,
    username varchar(255) not null,
    password varchar(255) not null,
    year tinyint unsigned not null
);