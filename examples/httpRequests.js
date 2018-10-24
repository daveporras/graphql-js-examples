componentDidMount () {

  axios({
    url: 'http://127.0.0.1:4000/graphql',
    method: 'post',
    data: {
      query: `
      query {
        songs {
          title,
          id
        }
      }
        `
    }
  }).then((result) => {
    console.log(result.data)
  });

  // OR

  const consulta = `
  query {
    songs {
      title,
      id
    }
  }
    `;

  axios.post('http://127.0.0.1:4000/graphql', {query: consulta} ).then(response => console.log(response.data));

}