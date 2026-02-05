exports.up = function (knex) {
    return knex.schema.createTable('vendors', (table) => {
      table.increments('id').primary();
      table.json('gst_details').notNullable();
      table.json('pan_details').notNullable();
      table.string('address').notNullable();
      table.string('company_certificate').nullable();
      table.string('std_code_with_phone').nullable();
      table.string('contact_person_name').notNullable();
      table.json('items_interested').notNullable(); // Array as JSON
      table.string('city').nullable();
      table.string('fax').nullable();
      table.string('contact_person_designation').nullable();
      table.string('state').notNullable();
      table.string('website').nullable();
      table.string('is_msme').notNullable();
      table.string('country').notNullable();
      table.string('mobile').notNullable();
      table.string('business_description').nullable();
      table.string('pin').notNullable();
      table.string('email').notNullable();
      table.string('msme_certificate').nullable();
      table.string('experience_and_reference').nullable();
      table.string('company_profile').notNullable();
      table.json('work_order_copies').nullable();
      table.json('project_images').nullable();
      table.json('company_financial').notNullable();
      table.string('bank_name').notNullable();
      table.string('account_number').notNullable();
      table.string('ifsc_code').notNullable();
      table.string('cancelled_cheque_copy').notNullable();
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('vendors');
  }; 