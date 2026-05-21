require('dotenv').config()
const pool = require('./db')

const migrate = async () => {
  const client = await pool.connect()

  try {
    console.log('🔄 Lancement des migrations...')

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id          SERIAL PRIMARY KEY,
        name        VARCHAR(100) NOT NULL,
        email       VARCHAR(255) UNIQUE NOT NULL,
        password    VARCHAR(255) NOT NULL,
        created_at  TIMESTAMP DEFAULT NOW(),
        updated_at  TIMESTAMP DEFAULT NOW()
      );
    `)
    console.log('✅ Table users créée')

    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id          SERIAL PRIMARY KEY,
        name        VARCHAR(150) NOT NULL,
        description TEXT,
        color       VARCHAR(7) DEFAULT '#3b82f6',
        user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at  TIMESTAMP DEFAULT NOW(),
        updated_at  TIMESTAMP DEFAULT NOW()
      );
    `)
    console.log('✅ Table projects créée')

    await client.query(`
      CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'done');
    `).catch(() => console.log('ℹ️  Type task_status existe déjà'))

    await client.query(`
      CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');
    `).catch(() => console.log('ℹ️  Type task_priority existe déjà'))

    await client.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id          SERIAL PRIMARY KEY,
        title       VARCHAR(255) NOT NULL,
        description TEXT,
        status      task_status DEFAULT 'todo',
        priority    task_priority DEFAULT 'medium',
        due_date    DATE,
        project_id  INTEGER REFERENCES projects(id) ON DELETE SET NULL,
        user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at  TIMESTAMP DEFAULT NOW(),
        updated_at  TIMESTAMP DEFAULT NOW()
      );
    `)
    console.log('✅ Table tasks créée')

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
      CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
      CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
      CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
    `)
    console.log('✅ Index créés')

    console.log('🎉 Migrations terminées avec succès')
  } catch (err) {
    console.error('❌ Erreur migration :', err.message)
    process.exit(1)
  } finally {
    client.release()
    pool.end()
  }
}

migrate()
