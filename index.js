const couchbase = require("couchbase");
const cluster = new couchbase.Cluster("couchbase://localhost");
cluster.authenticate("nodejs", "test123");
const bucket = cluster.openBucket("ameet");
const N1qlQuery = couchbase.N1qlQuery;

bucket.manager().createPrimaryIndex(function() {
  bucket.upsert(
    "user:king_arthur",
    {
      email: "kingarthur@couchbase.com",
      interests: ["Holy Grail", "African Swallows"]
    },
    function(err, result) {
      bucket.get("user:king_arthur", function(err, result) {
        console.log("Got result: %j", result.value);
        bucket.query(
          N1qlQuery.fromString(
            "SELECT * FROM ameet WHERE $1 in interests LIMIT 1"
          ),
          ["African Swallows"],
          function(err, rows) {
            console.log("Got rows: %j", rows);
          }
        );
      });
    }
  );
});
