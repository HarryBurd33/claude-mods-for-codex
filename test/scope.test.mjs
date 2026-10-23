import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, realpath, rm, readdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { checkMetadataScope, resolveMetadataProject } from '../src/scope.mjs';
import { runCli } from '../src/cli.mjs';

test('scope diagnostic distinguishes parent session from child tool workdir without writing or echoing identifiers', async t => {
  const parent = await mkdtemp(join(await realpath(tmpdir()), 'mods-scope-'));
  t.after(() => rm(parent, { recursive:true, force:true }));
  const selected = join(parent,'selected'); await mkdir(selected); await mkdir(join(selected,'nested'));
  assert.equal((await resolveMetadataProject(parent,selected)).matches,false);
  assert.equal((await resolveMetadataProject(join(selected,'nested'),selected)).matches,true);
  assert.equal((await resolveMetadataProject(selected)).projectId,selected);
  let result = '';
  await runCli(['scope','--project',selected,'--session-cwd',parent], {stdout:{write:value => result += value}});
  const data = JSON.parse(result);
  assert.equal(data.matches,false); assert.equal(data.producerHealth,'unknown');
  assert.equal(Object.values(data).some(value=>typeof value==='string'&&value.includes(parent)),false);
  assert.deepEqual(await readdir(parent),['selected']);
  assert.deepEqual(await readdir(selected),['nested']);
  assert.match(data.guidance,/workdir/);
});

test('scope diagnostic rejects invalid paths and a sibling sharing the selected prefix', async t => {
  const parent = await mkdtemp(join(await realpath(tmpdir()),'mods-scope-'));
  t.after(() => rm(parent,{recursive:true,force:true}));
  const selected=join(parent,'project'), sibling=join(parent,'project-other');
  await mkdir(selected); await mkdir(sibling); await writeFile(join(parent,'file'),'fixture');
  assert.equal((await checkMetadataScope(selected,sibling)).matches,false);
  await assert.rejects(checkMetadataScope(selected,join(parent,'file')),/directory/);
  for (const invalid of ['relative', '', selected+'\n', null, 'x'.repeat(4097)]) await assert.rejects(checkMetadataScope(selected,invalid));
  await assert.rejects(runCli(['scope','--project',selected],{}),/requires/);
});
