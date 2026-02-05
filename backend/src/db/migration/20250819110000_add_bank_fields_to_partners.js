exports.up = function (knex) {
  return knex.schema.alterTable('partners', (table) => {
    table.string('bank_name').notNullable();
    table.string('account_number').notNullable();
    table.string('ifsc_code').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('partners', (table) => {
    table.dropColumn('bank_name');
    table.dropColumn('account_number');
    table.dropColumn('ifsc_code');
  });
}; 