exports.up = function (knex) {
    return knex.schema.createTable('partners', (table) => {
      table.increments('id').primary();
      table.string('name', 255).notNullable();
      table.string('mobile', 20).notNullable();
      table.string('pan_number', 20).notNullable();
      table.string('address', 512).nullable();
      table.string('city', 255).notNullable();
      table.json('category_of_work').notNullable();
  
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('deleted_at').nullable();
  
      table.index(['mobile']);
      table.index(['pan_number']);
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists('partners');
  }; 