const port = process.env.API_SERVER_PORT || 4000
const baseUrl = `http://localhost:${port}`

const _fetch = async (method, path, body) => {
    body = typeof body === 'string' ? body : JSON.stringify(body)
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.API_SERVER_KEY}`,
    };
    const res = await fetch(baseUrl + path, { method, body, headers });
    if (res.status < 200 || res.status > 299)
        throw new Error(`API returned status ${res.status}`)
    return res.json()
}

test('GET /health', async () => {
    const health = await _fetch('get', '/api/health');
    expect(health).toEqual({ status: "Healthy" }); // Match the actual response object
})