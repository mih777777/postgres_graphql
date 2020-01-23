const graphql = require('graphql')
const {  GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt} = graphql

const { Client } = require('pg')

const client = new Client({
    user:'postgres',
    host:'localhost',
    database: 'kino',
    password:'1'
})

client.connect()



const MovieType = new GraphQLObjectType({
  name: 'Movie',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    director: {
      type: DirectorType,
      resolve(parent, args) {
        const id = parent.id
        return client.query('SELECT * from directors WHERE id = $1', [id])
            .then(res => res.rows[0])
      }
    }
  })
})

const DirectorType = new GraphQLObjectType({
  name: 'Director',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt }
  })
})


const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    movie: {
      type: MovieType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        const id = args.id
        return client.query('SELECT * from movies WHERE id = $1', [id])
            .then(res => res.rows[0])
      },
    },
    director: {
      type: DirectorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        const id = args.id
        return client.query('SELECT * from directors WHERE id = $1', [id])
            .then(res => res.rows[0])
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: Query
})
