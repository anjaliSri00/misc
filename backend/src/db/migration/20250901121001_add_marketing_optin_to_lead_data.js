exports.up = function(knex) {
  return knex.schema.table('lead_data', function(table) {
    table.boolean('marketing_optin').defaultTo(false);
  });
};

exports.down = function(knex) {
  return knex.schema.table('lead_data', function(table) {
    table.dropColumn('marketing_optin');
  });
};
