import fs from 'fs';
import path from 'path';
import git from 'isomorphic-git';

const projectDir = path.resolve('C:/Users/apurv/.gemini/antigravity/scratch/spendwise');

async function run() {
  console.log('[Git] Initializing Git repository in:', projectDir);

  // 1. Initialize Git repository
  await git.init({
    fs,
    dir: projectDir,
    defaultBranch: 'main',
  });

  // Verify .git exists
  const gitDir = path.join(projectDir, '.git');
  console.log('[Git] .git folder created:', fs.existsSync(gitDir));

  // 2. Discover all files recursively, skipping node_modules, .git, .env, data, dist
  const ignoredPatterns = [
    'node_modules',
    '.git',
    '.env',
    'dist',
    'build',
    'data',
    'package-lock.json',
  ];

  function getAllFiles(dir, base = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let files = [];
    for (const entry of entries) {
      const relPath = base ? `${base}/${entry.name}` : entry.name;
      
      // Check ignore
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist' || entry.name === 'build' || entry.name === 'data') {
          continue;
        }
        files = files.concat(getAllFiles(path.join(dir, entry.name), relPath));
      } else {
        if (entry.name === '.env' || (entry.name.startsWith('.env.') && !entry.name.endsWith('.example'))) {
          console.log('[Security] Excluded secret file from staging:', relPath);
          continue;
        }
        if (entry.name.endsWith('.log')) continue;
        files.push(relPath);
      }
    }
    return files;
  }

  const filesToAdd = getAllFiles(projectDir);
  console.log(`[Git] Found ${filesToAdd.length} files to stage:`);
  
  // 3. Stage each file
  for (const file of filesToAdd) {
    await git.add({
      fs,
      dir: projectDir,
      filepath: file,
    });
  }

  console.log('[Git] All files staged successfully.');

  // 4. Create initial commit
  const sha = await git.commit({
    fs,
    dir: projectDir,
    message: 'Initial commit: SpendWise Smart Expense Tracker',
    author: {
      name: 'Apurv Sharma',
      email: 'apurv@spendwise.app',
    },
  });

  console.log('[Git] Commit created successfully!');
  console.log('[Git] Commit SHA:', sha);
  console.log('[Git] Active Branch: main');

  // Verify HEAD and branch
  const currentBranch = await git.currentBranch({ fs, dir: projectDir });
  console.log('[Git] Confirmed Branch:', currentBranch);

  // List committed files
  const commit = await git.readCommit({ fs, dir: projectDir, oid: sha });
  console.log('[Git] Commit author:', commit.commit.author.name);
  console.log('[Git] Commit message:', commit.commit.message);
}

run().catch((err) => {
  console.error('[Git] Error:', err);
  process.exit(1);
});
