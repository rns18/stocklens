const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function runMigration() {
  console.log('Starting migration to Railway database...');

  // Setup connection to public Railway MySQL
  const connection = await mysql.createConnection({
    host: 'acela.proxy.rlwy.net',
    port: 51191,
    user: 'root',
    password: 'IWQsJtqxchWSISZcwSuNmpqVeCfWTKMg',
    database: 'railway',
    multipleStatements: true
  });

  try {
    // 1. Read and run schema.sql
    console.log('Reading schema.sql...');
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    let schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    // Clean up DELIMITER lines entirely
    schemaSql = schemaSql.replace(/DELIMITER\s+\S+/gi, '');

    // Split the schema by the double-slash '//'
    const chunks = schemaSql.split('//');
    const finalQueries = [];

    for (let chunk of chunks) {
      const trimmed = chunk.trim();
      if (!trimmed) continue;
      finalQueries.push(trimmed);
    }

    console.log(`Executing ${finalQueries.length} schema query blocks...`);
    for (let i = 0; i < finalQueries.length; i++) {
      console.log(`Executing block ${i + 1}/${finalQueries.length}...`);
      await connection.query(finalQueries[i]);
    }
    console.log('Schema applied successfully!');

    // 2. Read and run seed.sql
    console.log('Reading seed.sql...');
    const seedPath = path.join(__dirname, '..', 'database', 'seed.sql');
    const seedSql = fs.readFileSync(seedPath, 'utf8');

    console.log('Applying seed data...');
    await connection.query(seedSql);
    console.log('Seed data applied successfully!');

    console.log('Migration completed successfully! Your Railway DB is now populated.');
  } catch (err) {
    console.error('Migration failed:', err.message || err);
  } finally {
    await connection.end();
  }
}

runMigration();
