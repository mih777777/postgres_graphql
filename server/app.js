
const express = require('express')
const graphqlHTTP = require('express-graphql')
const schema = require('../schema/schema')

const app = express();


app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}))

app.listen(4000, err => {
  err ? console.log(err) : console.log('Server started!');
});
