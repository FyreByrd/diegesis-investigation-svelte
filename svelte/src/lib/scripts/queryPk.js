export const queryPk = async (query, cb) => {
    const res = await fetch('http://localhost:3000/data/proskomma',{
        method: 'POST',
        body: JSON.stringify({
            query: compressQuery(query)
        }),
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json'
        }
    });
    const j = await res.json();
    const s = JSON.stringify(j.text, null, 2);
    if(cb) cb(s);
    return s;
}

function compressQuery(query) {
    let s = query.replace(/\n/g, ' ');
    return s.replace(/([^\w])(\s+)/g, '$1');
}