exports.up = function (knex) {
  return knex.schema.createTable('passwords', (table) => {
    table.increments('id').primary();
    table.string('service', 30).notNullable();
    table.string('password', 32).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('passwords');
};