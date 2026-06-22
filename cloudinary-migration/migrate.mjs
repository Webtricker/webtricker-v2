// Cloudinary Asset Migration Script
//
// Run this on the VPS from /home/webtricker-v2/ so it can resolve mongoose:
//   node migrate.mjs          → backup + upload to new Cloudinary + show MongoDB diff
//   node migrate.mjs --write  → backup + upload + apply MongoDB changes
//
// SCP to VPS:  scp migrate.mjs root@85.31.225.81:/home/webtricker-v2/migrate.mjs
// Run dry run: ssh root@85.31.225.81 "node /home/webtricker-v2/migrate.mjs 2>&1 | tee /tmp/migration-dryrun.log"
// Run write:   ssh root@85.31.225.81 "node /home/webtricker-v2/migrate.mjs --write 2>&1 | tee /tmp/migration-write.log"

import { createHash } from 'node:crypto';
import { writeFileSync, mkdirSync } from 'node:fs';
import mongoose from 'mongoose';

const WRITE_MODE = process.argv.includes('--write');

const OLD = {
  cloud: 'dirjayri8',
  key: '277794687575465',
  secret: 'cLg194v_KTKqQEmskpvB6TustYY',
};

const NEW = {
  cloud: 'dnfvjnaki',
  key: '521539932655678',
  secret: 'a6yUX6N0RG8XbdfixIpHPmg5LQE',
};

const MONGODB_URI =
  'mongodb+srv://teamwebtricker:TeamWEBtricker_@cluster0.ovnyx33.mongodb.net/webtricker';

const BACKUP_DIR =
  `./cld-migration-backup-${new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-')}`;

// ── Cloudinary helpers ─────────────────────────────────────────────────────

const basicAuth = (c) =>
  'Basic ' + Buffer.from(`${c.key}:${c.secret}`).toString('base64');

async function listAll(creds) {
  const all = [];
  for (const type of ['image', 'video', 'raw']) {
    let cursor = null;
    do {
      let url = `https://api.cloudinary.com/v1_1/${creds.cloud}/resources/${type}?max_results=500`;
      if (cursor) url += `&next_cursor=${encodeURIComponent(cursor)}`;
      const res = await fetch(url, { headers: { Authorization: basicAuth(creds) } });
      if (res.status === 404) break;
      const d = await res.json();
      if (!res.ok) {
        if (d?.error?.message?.includes('not found')) break;
        throw new Error(`Cloudinary list ${type}: ${JSON.stringify(d.error)}`);
      }
      all.push(...(d.resources || []));
      cursor = d.next_cursor || null;
      process.stdout.write('.');
    } while (cursor);
  }
  console.log('');
  return all;
}

async function uploadToNew(asset) {
  const ts = String(Math.floor(Date.now() / 1000));
  // Signature: sorted params + secret (no separator before secret)
  const sig = createHash('sha1')
    .update(`public_id=${asset.public_id}&timestamp=${ts}${NEW.secret}`)
    .digest('hex');
  const body = new URLSearchParams({
    file: asset.secure_url,
    public_id: asset.public_id,
    timestamp: ts,
    api_key: NEW.key,
    signature: sig,
  });
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${NEW.cloud}/${asset.resource_type}/upload`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    }
  );
  const d = await res.json();
  if (!res.ok) throw new Error(d?.error?.message || `HTTP ${res.status}`);
  return d;
}

// ── URL helpers ────────────────────────────────────────────────────────────

// Matches any old-account Cloudinary URL in a string
const makeOldRe = () =>
  /https?:\/\/res\.cloudinary\.com\/dirjayri8\/[^"'\s<>)]+/g;

const hasOldUrl = (str) => makeOldRe().test(str);

function extractOldUrls(str) {
  return [...str.matchAll(makeOldRe())].map((m) => m[0]);
}

// Recursively replace old Cloudinary URLs in any JS value.
// Leaves MongoDB BSON types (ObjectId, Date, Buffer, etc.) untouched.
function deepReplace(v) {
  if (typeof v === 'string') {
    return v.replace(makeOldRe(), (u) => u.replace('/dirjayri8/', '/dnfvjnaki/'));
  }
  if (Array.isArray(v)) return v.map(deepReplace);
  if (v && typeof v === 'object' && Object.getPrototypeOf(v) === Object.prototype) {
    const out = {};
    for (const [k, val] of Object.entries(v)) out[k] = deepReplace(val);
    return out;
  }
  return v; // ObjectId, Date, Buffer, Decimal128, etc. — unchanged
}

// ── Main ───────────────────────────────────────────────────────────────────

const SEP = '─'.repeat(62);
const DBL = '═'.repeat(62);

async function main() {
  console.log(`\n${DBL}`);
  console.log('  CLOUDINARY ASSET MIGRATION');
  console.log(
    `  Mode: ${WRITE_MODE ? '⚡  WRITE — will update MongoDB' : '🔍  DRY RUN — MongoDB will NOT be modified'}`
  );
  console.log(`${DBL}\n`);

  // ── STEP 1: MongoDB backup ─────────────────────────────────────────────
  console.log(`${SEP}\nSTEP 1: MongoDB backup\n${SEP}`);
  await mongoose.connect(MONGODB_URI);
  console.log('  Connected to MongoDB Atlas');

  mkdirSync(BACKUP_DIR, { recursive: true });
  const db = mongoose.connection.db;
  const colNames = (await db.listCollections().toArray()).map((c) => c.name);

  for (const name of colNames) {
    const docs = await db.collection(name).find({}).toArray();
    writeFileSync(`${BACKUP_DIR}/${name}.json`, JSON.stringify(docs, null, 2));
    console.log(`  ${name}: ${docs.length} docs`);
  }
  console.log(`\n  ✅ Backup complete → ${BACKUP_DIR}\n`);

  // ── STEP 2: List Cloudinary assets ────────────────────────────────────
  console.log(`${SEP}\nSTEP 2: List Cloudinary assets\n${SEP}`);

  process.stdout.write('  Old account (dirjayri8): ');
  const oldAssets = await listAll(OLD);
  const oldByPublicId = new Map(oldAssets.map((a) => [a.public_id, a]));
  console.log(`  → ${oldAssets.length} total assets`);

  process.stdout.write('  New account (dnfvjnaki): ');
  const newAssets = await listAll(NEW);
  const newIds = new Set(newAssets.map((a) => a.public_id));
  console.log(`  → ${newAssets.length} total assets\n`);

  // ── STEP 3: Scan MongoDB for old URLs ─────────────────────────────────
  console.log(`${SEP}\nSTEP 3: Scan MongoDB for old Cloudinary URLs\n${SEP}`);
  const allOldUrlsInMongo = new Set();
  const affectedDocs = {}; // { colName: doc[] }

  for (const name of colNames) {
    const docs = await db.collection(name).find({}).toArray();
    const hits = docs.filter((d) => hasOldUrl(JSON.stringify(d)));
    if (hits.length) {
      affectedDocs[name] = hits;
      hits.forEach((d) => extractOldUrls(JSON.stringify(d)).forEach((u) => allOldUrlsInMongo.add(u)));
      console.log(`  ${name}: ${hits.length} docs contain old Cloudinary URLs`);
    }
  }

  console.log(`\n  Total unique old URLs in MongoDB: ${allOldUrlsInMongo.size}`);
  console.log(`  Collections affected: ${Object.keys(affectedDocs).join(', ')}\n`);

  // ── STEP 4: Upload missing assets to new account ───────────────────────
  console.log(`${SEP}\nSTEP 4: Upload missing assets to new Cloudinary account\n${SEP}`);

  const isReferencedInMongo = (asset) =>
    [...allOldUrlsInMongo].some((u) => u.includes('/' + asset.public_id));

  const missing = oldAssets.filter((a) => !newIds.has(a.public_id));
  const needed = missing.filter(isReferencedInMongo);
  const orphaned = missing.filter((a) => !isReferencedInMongo(a));

  console.log(`  Missing from new account: ${missing.length}`);
  console.log(`    Referenced in MongoDB (will upload): ${needed.length}`);
  console.log(`    Not referenced anywhere (orphaned):  ${orphaned.length}\n`);

  let uploadOk = 0, uploadExist = 0, uploadFail = 0;
  const uploadLog = [];

  for (let i = 0; i < needed.length; i++) {
    const a = needed[i];
    const tag = `[${String(i + 1).padStart(3)}/${needed.length}] ${a.resource_type}/${a.public_id}`;
    try {
      const r = await uploadToNew(a);
      uploadLog.push({ status: 'ok', publicId: a.public_id, resource_type: a.resource_type, newUrl: r.secure_url });
      uploadOk++;
      console.log(`  ✅ ${tag}`);
    } catch (e) {
      if (/already exists|already been used/i.test(e.message)) {
        uploadLog.push({ status: 'exists', publicId: a.public_id });
        uploadExist++;
        console.log(`  ⏭  ${tag} (already in new account)`);
      } else {
        uploadLog.push({ status: 'error', publicId: a.public_id, error: e.message });
        uploadFail++;
        console.error(`  ❌ ${tag}: ${e.message}`);
      }
    }
  }

  writeFileSync(`${BACKUP_DIR}/upload-log.json`, JSON.stringify(uploadLog, null, 2));
  console.log(`\n  Uploads: ${uploadOk} new, ${uploadExist} already existed, ${uploadFail} failed`);
  if (uploadFail > 0) console.warn(`  ⚠️  ${uploadFail} uploads failed — check ${BACKUP_DIR}/upload-log.json`);
  console.log('');

  // ── STEP 5: Compute MongoDB change plan ───────────────────────────────
  console.log(`${SEP}\nSTEP 5: MongoDB change plan\n${SEP}`);
  const changePlan = []; // [{ collection, _id, $set }]

  for (const [colName, docs] of Object.entries(affectedDocs)) {
    for (const doc of docs) {
      // Exclude top-level Mongoose internals from $set
      const { _id, __v, ...fields } = doc;
      const newFields = deepReplace(fields);

      // Only include fields that actually changed
      const $set = {};
      for (const k of Object.keys(fields)) {
        if (JSON.stringify(fields[k]) !== JSON.stringify(newFields[k])) {
          $set[k] = newFields[k];
        }
      }
      if (Object.keys($set).length > 0) {
        changePlan.push({ collection: colName, _id, $set });
      }
    }
  }

  writeFileSync(`${BACKUP_DIR}/change-plan.json`, JSON.stringify(changePlan, null, 2));

  // Per-collection count
  const byColl = {};
  changePlan.forEach((c) => { byColl[c.collection] = (byColl[c.collection] || 0) + 1; });
  console.log(`  Documents to update: ${changePlan.length} total`);
  for (const [col, count] of Object.entries(byColl)) {
    console.log(`    ${col}: ${count}`);
  }

  // Sample diff — one doc per collection
  console.log('\n  ── Sample changes (first doc per collection) ──');
  const shownCols = new Set();
  for (const change of changePlan) {
    if (shownCols.has(change.collection)) continue;
    shownCols.add(change.collection);
    const originalDoc = affectedDocs[change.collection]?.find(
      (d) => String(d._id) === String(change._id)
    );
    const changedFields = Object.keys(change.$set);
    console.log(`\n  [${change.collection}] _id: ${change._id}`);
    for (const f of changedFields.slice(0, 2)) {
      const oldSnip = JSON.stringify(originalDoc?.[f])?.slice(0, 100) ?? '';
      const newSnip = JSON.stringify(change.$set[f])?.slice(0, 100) ?? '';
      console.log(`    .${f}:`);
      console.log(`      WAS: ${oldSnip}…`);
      console.log(`      NOW: ${newSnip}…`);
    }
    if (changedFields.length > 2) console.log(`    (+${changedFields.length - 2} more field(s))`);
  }
  console.log(`\n  Full change plan saved to: ${BACKUP_DIR}/change-plan.json\n`);

  // ── Orphaned assets report ─────────────────────────────────────────────
  console.log(`${SEP}\nOrphaned assets (in old account, NOT referenced in MongoDB)\n${SEP}`);
  if (orphaned.length === 0) {
    console.log('  None — every old asset is referenced in MongoDB.');
  } else {
    orphaned.forEach((a) =>
      console.log(`  ${a.resource_type}/${a.public_id}.${a.format || '?'}  (${a.bytes ? Math.round(a.bytes / 1024) + ' KB' : 'size unknown'})`)
    );
  }
  console.log(`  Total: ${orphaned.length} orphaned assets\n`);

  // ── Dry run exit ───────────────────────────────────────────────────────
  if (!WRITE_MODE) {
    console.log(DBL);
    console.log('  DRY RUN COMPLETE — MongoDB was NOT modified.');
    console.log('');
    console.log(`  Assets uploaded to new Cloudinary:  ${uploadOk + uploadExist} / ${needed.length}`);
    console.log(`  MongoDB documents queued to update: ${changePlan.length}`);
    if (uploadFail > 0) {
      console.log(`  ⚠️  Upload failures:                ${uploadFail} (review before proceeding)`);
    }
    console.log(`  Backup + plan saved to:             ${BACKUP_DIR}`);
    console.log('');
    console.log('  Review the output above, then run:');
    console.log('    node migrate.mjs --write');
    console.log(DBL);
    await mongoose.disconnect();
    return;
  }

  // ── STEP 6: Apply MongoDB changes ─────────────────────────────────────
  console.log(`${SEP}\nSTEP 6: Applying MongoDB changes\n${SEP}`);
  let writeOk = 0, writeFail = 0;
  const writeLog = [];

  for (const colName of Object.keys(affectedDocs)) {
    const changes = changePlan.filter((c) => c.collection === colName);
    if (!changes.length) continue;

    process.stdout.write(`  ${colName} (${changes.length}): `);
    for (const change of changes) {
      try {
        await db.collection(colName).updateOne({ _id: change._id }, { $set: change.$set });
        writeOk++;
        writeLog.push({ collection: colName, _id: String(change._id), status: 'ok' });
        process.stdout.write('✓');
      } catch (e) {
        writeFail++;
        writeLog.push({ collection: colName, _id: String(change._id), status: 'error', error: e.message });
        process.stdout.write('✗');
        console.error(`\n    ❌ ${colName}/${change._id}: ${e.message}`);
      }
    }
    console.log('');
  }

  writeFileSync(`${BACKUP_DIR}/write-log.json`, JSON.stringify(writeLog, null, 2));

  console.log(`\n${DBL}`);
  console.log('  ✅ MIGRATION COMPLETE');
  console.log(`  MongoDB updated: ${writeOk} ok, ${writeFail} failed`);
  console.log(`  Write log: ${BACKUP_DIR}/write-log.json`);
  console.log(DBL);

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error('\nFATAL ERROR:', e.message);
  if (e.stack) console.error(e.stack);
  process.exit(1);
});
