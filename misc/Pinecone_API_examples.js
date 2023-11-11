const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY';  // Replace with your OpenAI API key

// Pinecone Keys and API endpoints:
const PINECONE_API_KEY = '702cede5-7fbb-499f-a78b-ccc4ca25f277';
// Project ID: 33eb9e1

// Vector Operations
const PC_DESCRIBE_URL = 'https://{indexName}-33eb9e1.svc.us-west4-gcp-free.pinecone.io/describe_index_stats';
const PC_QUERY_URL = 'https://{indexName}-33eb9e1.svc.us-west4-gcp-free.pinecone.io/query';
const PC_DELETE_URL = 'https://{indexName}-33eb9e1.svc.us-west4-gcp-free.pinecone.io/vectors/delete';
const PC_FETCH_URL = 'https://{indexName}-33eb9e1.svc.us-west4-gcp-free.pinecone.io/vectors/fetch';
const PC_UPDATE_URL = 'https://{indexName}-33eb9e1.svc.us-west4-gcp-free.pinecone.io/vectors/update';
const PC_UPSERT_URL = 'https://{indexName}-33eb9e1.svc.us-west4-gcp-free.pinecone.io/vectors/upsert';

// Index/Collection Operations
const PC_LC_COLLECTIONS_URL = 'https://controller.us-west4-gcp-free.pinecone.io/collections';                   // List or Create Collection
const PC_DD_COLLECTIONS_URL = 'https://controller.us-west4-gcp-free.pinecone.io/collections/{collectionName}';  // Describe or Delete Collection
const PC_LC_INDEXES_URL = 'https://controller.us-west4-gcp-free.pinecone.io/databases';                         // List or Create Indexes
const PC_DDC_INDEXES_URL = 'https://controller.us-west4-gcp-free.pinecone.io/databases/{indexName}';            // Describe, Delete, or Configure Indexes

// Function to obtain Ada embedding (a 1536 dim vector)
async function obtainAda(text) {
    var emb_url = 'https://api.openai.com/v1/embeddings';
    const upload = {
        model: "text-embedding-ada-002",
        input: text,
    };

    const response = await fetch(emb_url, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + OPENAI_API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(upload)
    });

    if (response.status === 200) {
        var responseData = await response.json();
        var embedding = responseData.data[0].embedding;
        return embedding;
    } else {
        console.error('Error:', response.statusText);
    }
}

function testPinecone() {
    // Test using some arbitrary text embedded by ADA
    var text = "This is an arbitrary string of text which can be embedded. La-dee-da";
    var embedding = obtainAda(text);

    /* ( 0 ) */
    // create parametric payloads/options
    var reply;

    // ListIndexes:
    var li_options = {
        method: 'GET',
        headers: {
            'accept': 'application/json; charset=utf-8',
            'Api-Key': PINECONE_API_KEY
        }
    }

    // CreateIndex: CHECK PLAINTEXT ACCEPTANCE
    var ci_options = {
        method: 'POST',
        headers: {
            'accept': 'text/plain',
            'Api-Key': PINECONE_API_KEY
        },
        body: JSON.stringify({})
    }
    var ci_payload = {
        name: 'index1',
        dimension: 1536,
        metric: 'cosine',
        pods: 1,
        replicas: 1,
        pod_type: 'p1.x1',
        source_collection: 'string'
    };

    // DescribeIndex
    // the API URL will need to be edited to include the specific index name
    var desci_options = {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'Api-Key': PINECONE_API_KEY
        }
    }

    // DescribeIndexStats
    // NOTE: can be configured with a payload to get stats on some vector id or filter
    var dis_options = {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Api-Key': PINECONE_API_KEY
        },
        body: JSON.stringify({})
    }

    // UPSERT
    var u_options = {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Api-Key': PINECONE_API_KEY
        },
        body: JSON.stringify({})
    }
    var u_payload = {
        vectors: [
            {
                values: embedding,
                metadata: { type: 'instruction' },
                id: 'vector1',
            }
        ],
        namespace: 'namespace1'
    }

    // FETCH
    var f_options = {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'Api-Key': PINECONE_API_KEY
        },
        body: JSON.stringify({})
    }
    var f_payload = {
        vectors: ['vector1']
    }

    // QUERY
    var q_options = {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Api-Key': PINECONE_API_KEY
        },
        body: JSON.stringify({})
    }
    // filter needs to be tested on a larger, tagged set
    // ID & Vector need to be defined in run
    // Each query() request can contain only one of the parameters queries, vector, or id.
    var q_payload = {
        namespace: 'example-namespace',
        topK: 1,
        includeValues: true,
        includeMetadata: true,
        vector: [],
        id: ''
    }

    // ListCollections
    var lc_options = {
        method: 'GET',
        headers: {
            'accept': 'application/json; charset=utf-8',
            'Api-Key': PINECONE_API_KEY
        }
    }

    // CreateCollection
    var cc_options = {
        method: 'POST',
        headers: {
            'accept': 'text/plain',
            'Api-Key': PINECONE_API_KEY
        },
        body: JSON.stringify({})
    }
    var cc_payload = {
        name: 'collection1',
        source: 'index1'
    }

    // Delete (index)
    var di_options = {
        method: 'DELETE',
        headers: {
            'accept': 'text/plain'
        }
    }

    // Delete (vector)
    /*
    Options for deletion via filtering and other namespaces etc, additional options detailed by comment

        deleteAll: boolean,
        namespace: 'example-namespace'
        filter: {keys + filter logic ie $eq $neq}
    */
    var dv_options = {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Api-Key': PINECONE_API_KEY
        },
        body: JSON.stringify({})
    }
    var dv_payload = {
        ids: ['vector1'],
    }

    // DescribeCollection
    var desc_options = {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'Api-Key': PINECONE_API_KEY
        }
    }

    // DeleteCollection
    var delc_options = {
        method: 'DELETE',
        headers: {
            'accept': 'text/plain'
        }
    }

    /* ( 1 ) > ListIndexes > CreateIndex > ListIndices > DescribeIndex > DescribeIndexStats  */

    // ListIndexes
    reply = fetch(PC_LC_INDEXES_URL, li_options)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error("Error:", error));

    // CreateIndex
    ci_payload.name = 'first-index';
    delete ci_payload['source_collection']; // optional for bringing an archived index back online
    ci_options.body = JSON.stringify(ci_payload);
    fetch(PC_LC_INDEXES_URL, ci_options);

    // DescribeIndex
    // need to get status, and upon success continue, done by doing describe index
    // should loop and do iterative describe calls
    var ready = false;
    var ddci_url = PC_DDC_INDEXES_URL.replace('{indexName}', ci_payload.name);
    (async () => {
        while (!ready) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            reply = await fetch(ddci_url, desci_options);
            var temp = await reply.json();
            console.log(temp.status.ready);
            ready = temp.status.ready;
        }
    })();

    // ListIndexes
    reply = fetch(PC_LC_INDEXES_URL, li_options)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error("Error:", error));

    // DescribeIndex
    var ddci_url = PC_DDC_INDEXES_URL.replace('{indexName}', ci_payload.name);
    reply = fetch(ddci_url, desci_options)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error("Error:", error));

    // DescribeIndexStats
    var describe_url = PC_DESCRIBE_URL.replace('{indexName}', ci_payload.name);
    reply = fetch(describe_url, dis_options)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error("Error:", error));

    /* ( 2 ) > Upsert > Fetch > Query  */

    // Upsert
    u_options.body = JSON.stringify(u_payload);
    var upsert_url = PC_UPSERT_URL.replace('{indexName}', ci_payload.name);
    reply = fetch(upsert_url, u_options)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error("Error:", error));

    // Fetch
    f_options.body = JSON.stringify(f_payload);
    var fetch_url = PC_FETCH_URL.replace('{indexName}', ci_payload.name);
    reply = fetch(fetch_url, f_options)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error("Error:", error));

    // Query (will need to test on a set of documents/vectors)
    // call openAI ada-002 with query embedding vector
    // Each query() request can contain only one of the parameters queries, vector, or id.
    var query_embedding = obtainAda('A document containing instructions and explanations concerning the use of a google apps-script based tool meant for lawyers.');
    delete q_payload['id'];
    q_payload.vector = query_embedding;
    q_options.body = JSON.stringify(q_payload);
    var query_url = PC_QUERY_URL.replace('{indexName}', ci_payload.name);
    reply = fetch(query_url, q_options)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error("Error:", error));

    /* ( 3 ) > ListCollections > CreateCollection > ListCollections  */

    // ListCollections
    reply = fetch(PC_LC_COLLECTIONS_URL, lc_options)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error("Error:", error));

    // CreateCollection
    cc_options.body = JSON.stringify(cc_payload);
    reply = fetch(PC_LC_COLLECTIONS_URL, cc_options)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error("Error:", error));

    // ListCollections
    reply = fetch(PC_LC_COLLECTIONS_URL, lc_options)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error("Error:", error));

    /* ( 4 ) > Delete > ListIndexes */

    // Delete (vector)
    dv_options.body = JSON.stringify(dv_payload);
    var delete_url = PC_DELETE_URL.replace('{indexName}', ci_payload.name);
    reply = fetch(delete_url, dv_options)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error("Error:", error));

    // ListIndexes
    reply = fetch(PC_LC_INDEXES_URL, li_options)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error("Error:", error));

    /* ( 5 ) > ListCollection > DescribeCollection  */

    // ListCollections
    reply = fetch(PC_LC_COLLECTIONS_URL, lc_options)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error("Error:", error));

    // DescribeCollection
    // need to configure last 16 chars as collection name
    var dc_url = PC_DD_COLLECTIONS_URL.replace('{collectionName}', cc_payload.name);
    reply = fetch(dc_url, desc_options)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error("Error:", error));

    /* ( 6 ) > CreateIndex (FC) > ListIndexes */

    // CreateIndex (FC)
    // May take up to 10 minutes - may require a pause
    // Double-check source_collection
    // may be doable with a while loop, otherwise, create an alert system of some variety?
    ci_payload['source_collection'] = 'collection1';
    ci_payload.name = 'revived-index1';
    ci_options.body = JSON.stringify(ci_payload);
    reply = fetch(PC_LC_INDEXES_URL, ci_options)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error("Error:", error));

    // ListIndexes
    reply = fetch(PC_LC_INDEXES_URL, li_options)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error("Error:", error));

    /* ( 7 ) > ListCollection > DescribeCollection > DeleteCollection */

    // ListCollections
    reply = fetch(PC_LC_COLLECTIONS_URL, lc_options)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error("Error:", error));

    // DescribeCollection
    reply = fetch(dc_url, desc_options); // url should be fine
    reply.then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error("Error:", error));

    // DeleteCollection
    reply = fetch(dc_url, delc_options); // ditto
    reply.then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error("Error:", error));

    /* ( 8 ) > DescribeIndexStats > Delete */

    // DescribeIndexStats
    reply = fetch(PC_DESCRIBE_URL, dis_options)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error("Error:", error));

    // Delete (index)
    var deli_url = PC_DDC_INDEXES_URL.replace('{indexName}', ci_payload.name);
    reply = fetch(deli_url, di_options)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error("Error:", error));

    // ListIndexes
    reply = fetch(PC_LC_INDEXES_URL, li_options)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error("Error:", error));
}
