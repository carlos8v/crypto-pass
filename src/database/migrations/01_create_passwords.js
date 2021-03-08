exports.up = function (knex) {
  return knex.schema.createTable('passwords', (table) => {
    table.increments('password_id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.string('service', 30).notNullable();
    table.string('password', 32).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();

    table.foreign('user_id').references('user_id')
      .inTable('users')
      .onDelete('CASCADE');
  });
}

exports.down = function (knex) {
  return knex.schema.dropTable('passwords');
}
