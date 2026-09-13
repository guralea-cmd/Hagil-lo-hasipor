// One-time move (2026-09-13) of private contact details out of documents that
// anyone can read once approved (firestore.rules can't hide single fields) into
// admin-only collections with the same document id.
//
// For each document: copy the listed fields into the private doc and delete them
// from the public doc in ONE batch, so a field is never removed without being
// saved first. No other field is read-back, changed or removed. Documents that
// no longer hold any of the fields are skipped, so running it again is harmless.
// Used by the "העברת פרטי קשר" button in admin/dashboard.js.
var CONTACT_FIELD_MIGRATIONS = [
  { from: "story_submissions", to: "story_contacts", fields: ["phone", "email", "links"] },
  { from: "stories", to: "story_contacts", fields: ["email"] },
  { from: "ad_submissions", to: "ad_contacts", fields: ["contactName", "phone", "email", "notes"] }
];

// db: a signed-in Firestore instance. deleteField: returns a FieldValue.delete() sentinel.
// Resolves to { migrated, skipped, byCollection: { name: migratedCount } }.
// On failure rejects with the original error, with err.migrated = docs already moved.
function migrateContactFields(db, deleteField) {
  var result = { migrated: 0, skipped: 0, byCollection: {} };

  function migrateDoc(plan, doc) {
    var data = doc.data() || {};
    var contact = {};
    var removal = {};
    var found = false;
    plan.fields.forEach(function (field) {
      if (Object.prototype.hasOwnProperty.call(data, field)) {
        contact[field] = data[field];
        removal[field] = deleteField();
        found = true;
      }
    });
    if (!found) {
      result.skipped++;
      return Promise.resolve();
    }
    var batch = db.batch();
    batch.set(db.collection(plan.to).doc(doc.id), contact, { merge: true });
    batch.update(db.collection(plan.from).doc(doc.id), removal);
    return batch.commit().then(function () {
      result.migrated++;
      result.byCollection[plan.from] = (result.byCollection[plan.from] || 0) + 1;
    });
  }

  return CONTACT_FIELD_MIGRATIONS.reduce(function (chain, plan) {
    return chain.then(function () {
      result.byCollection[plan.from] = 0;
      return db.collection(plan.from).get().then(function (snapshot) {
        return snapshot.docs.reduce(function (docChain, doc) {
          return docChain.then(function () { return migrateDoc(plan, doc); });
        }, Promise.resolve());
      });
    });
  }, Promise.resolve())
    .then(function () { return result; })
    .catch(function (err) {
      if (err && typeof err === "object") err.migrated = result.migrated;
      throw err;
    });
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { migrateContactFields: migrateContactFields, CONTACT_FIELD_MIGRATIONS: CONTACT_FIELD_MIGRATIONS };
}
