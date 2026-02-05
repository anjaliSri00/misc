exports.up = function(knex) {
  return knex.schema.createTable('lead_data', function(table) {
    table.increments('id').primary();
    table.string('interior_service').notNullable();
    table.string('type_of_project').notNullable();
    table.string('property_size').notNullable();
    table.string('budget').notNullable();
    table.string('hiring_decision').notNullable();
    table.string('city').notNullable();
    table.string('name').notNullable();
    table.string('email').notNullable();
    table.string('mobile').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('lead_data');
};


