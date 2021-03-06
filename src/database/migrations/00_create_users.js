exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('user_id').primary();
    table.string('username', 30).notNullable().unique();
    table.string('password', 32).notNullable();    
    table.string('email').notNullable();
    table.timestamp('created_at').notNullable();
  });
}

exports.down = function (knex) {
  return knex.schema.dropTable('users');
}
