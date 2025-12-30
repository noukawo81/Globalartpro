/**
 * Migration: create museum schema
 */

exports.up = async function (knex) {
  // Ensure pgcrypto (gen_random_uuid) is available
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

  await knex.schema.createTable('museum_items', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('artist_id').notNullable();
    t.string('title').notNullable();
    t.text('description');
    t.string('media_url');
    t.enu('status', ['exposé', 'qualifié', 'enchère', 'vendu', 'archivé']).defaultTo('exposé');
    t.timestamp('entered_at').defaultTo(knex.fn.now());
    t.timestamp('cycle_end_at').nullable();
    t.uuid('auction_id').nullable();
    t.jsonb('metadata').defaultTo(knex.raw("'{}'::jsonb"));
  });

  await knex.schema.createTable('likes', (t) => {
    t.increments('id').primary();
    t.uuid('user_id').notNullable();
    t.uuid('museum_item_id').notNullable().references('id').inTable('museum_items').onDelete('CASCADE');
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.unique(['user_id', 'museum_item_id']);
  });

  await knex.schema.createTable('comments', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('museum_item_id').notNullable().references('id').inTable('museum_items').onDelete('CASCADE');
    t.uuid('user_id').notNullable();
    t.uuid('parent_id').nullable();
    t.text('content').notNullable();
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.timestamp('updated_at').nullable();
  });

  await knex.schema.createTable('rewards', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('artist_id').notNullable();
    t.uuid('museum_item_id').nullable().references('id').inTable('museum_items').onDelete('SET NULL');
    t.enu('type', ['selection','qualification','auction']).notNullable();
    t.decimal('amount', 14, 4).nullable();
    t.string('currency').nullable();
    t.jsonb('tx_meta').defaultTo(knex.raw("'{}'::jsonb"));
    t.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('auctions', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('museum_item_id').notNullable().references('id').inTable('museum_items').onDelete('CASCADE');
    t.timestamp('start_at').notNullable();
    t.timestamp('end_at').notNullable();
    t.decimal('starting_bid', 14, 4).nullable();
    t.uuid('highest_bid_id').nullable();
    t.enu('status', ['open','closed','settled']).defaultTo('open');
    t.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('audit_logs', (t) => {
    t.bigIncrements('id').primary();
    t.uuid('actor_id').nullable();
    t.string('action').notNullable();
    t.string('target_type').nullable();
    t.string('target_id').nullable();
    t.jsonb('payload').defaultTo(knex.raw("'{}'::jsonb"));
    t.timestamp('ts').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('scores', (t) => {
    t.uuid('museum_item_id').primary().references('id').inTable('museum_items').onDelete('CASCADE');
    t.decimal('computed_score', 14, 4).defaultTo(0);
    t.timestamp('computed_at').nullable();
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('scores');
  await knex.schema.dropTableIfExists('audit_logs');
  await knex.schema.dropTableIfExists('auctions');
  await knex.schema.dropTableIfExists('rewards');
  await knex.schema.dropTableIfExists('comments');
  await knex.schema.dropTableIfExists('likes');
  await knex.schema.dropTableIfExists('museum_items');
};
