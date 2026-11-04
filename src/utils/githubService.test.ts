import { test } from 'node:test';
import assert from 'node:assert';
import {
  filterCompendiumGists,
  GitHubGist,
} from './githubService.ts';

test('filterCompendiumGists detects compendium and loadout gists', () => {
  const mockGists: GitHubGist[] = [
    {
      id: 'gist1',
      description: 'Random python script',
      html_url: 'https://gist.github.com/1',
      created_at: '2026-01-01',
      updated_at: '2026-01-01',
      public: true,
      files: {
        'script.py': { filename: 'script.py', raw_url: '', size: 100 },
      },
    },
    {
      id: 'gist2',
      description: 'Tech Compendium Backup: Netrunner Solo',
      html_url: 'https://gist.github.com/2',
      created_at: '2026-01-02',
      updated_at: '2026-01-02',
      public: false,
      files: {
        'tech-compendium-loadout.json': { filename: 'tech-compendium-loadout.json', raw_url: '', size: 500 },
        'README.md': { filename: 'README.md', raw_url: '', size: 200 },
      },
    },
    {
      id: 'gist3',
      description: 'Cyberpunk 2090 gear list',
      html_url: 'https://gist.github.com/3',
      created_at: '2026-01-03',
      updated_at: '2026-01-03',
      public: true,
      files: {
        'weapons.json': { filename: 'weapons.json', raw_url: '', size: 300 },
      },
    },
  ];

  const filtered = filterCompendiumGists(mockGists);
  assert.strictEqual(filtered.length, 2);
  assert.strictEqual(filtered[0].id, 'gist2');
  assert.strictEqual(filtered[1].id, 'gist3');
});
