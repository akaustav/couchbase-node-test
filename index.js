const couchbase = require('couchbase');
const cluster = new couchbase.Cluster('couchbase://corbin');
cluster.authenticate('nodejs', 'test123');
const BUCKET_NAME = 'ameet';

const bucket = cluster.openBucket('ameet');
console.info(`Established connection to couchbase bucket ${BUCKET_NAME}`);

const N1qlQuery = couchbase.N1qlQuery;

bucket.manager().createPrimaryIndex(function() {
  bucket.upsert(
    'user:king_arthur',
    {
      email: 'kingarthur@couchbase.com',
      interests: ['Holy Grail', 'African Swallows']
    },
    function(err, result) {
      bucket.get('user:king_arthur', function(err, result) {
        if (err) {
          throw err;
        }
        console.log('Got result: %j', result.value);
        bucket.query(
          N1qlQuery.fromString(
            'SELECT * FROM ameet WHERE $1 in interests LIMIT 1'
          ),
          ['African Swallows'],
          function(err, rows) {
            if (err) {
              throw err;
            }
            console.log('Got rows: %j', rows);
          }
        );
      });
    }
  );
});
