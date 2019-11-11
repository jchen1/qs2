import knex from 'knex';
export declare function connect(options: knex.MySqlConnectionConfig): Promise<knex<any, unknown[]>>;
