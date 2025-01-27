console.log("Inside container")

 let x = await fetch('http://localhost:4000/api/health', {
    method: 'GET', // you can explicitly specify the method if you want, it's optional for GET requests
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer cdhub-api-key-123'
    }
  });

  x = await x.json();
  console.log(x);
}

hello();
