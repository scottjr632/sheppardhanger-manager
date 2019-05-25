create table refreshtokens (
    userid bigint primary key references users(id),
    tokenname text,
    token text,
    expireat date
);