import { gql, UserInputError } from 'apollo-server'
import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { v1 as uuid } from 'uuid'
// import { v1 } from "uuid"

const persons = [
    {
        age: '19',
        name: 'midu',
        phone: '9019-818221',
        street: 'calle nose',
        city: 'cdmx',
        id: '3456879021l-134536-91893',
    },
    {
        name: 'eklsafj',
        phone: '9019-721893',
        street: 'calle si se',
        city: 'cdmx1',
        id: '3456879021lja190-138901-dsh-91893',
    },
    {
        age: '10',
        name: 'tu mama',
        phone: '',
        street: 'calle no lo se',
        city: 'cdmx3',
        id: 'idsfjalk719hndf09-jksd1-134536-91893',
    },
]

const typeDefs = gql`
    enum YesNo {
        YES
        NO
    }

    type Address {
        street: String!
        city: String!
    }

    type Person {
        age: String
        canDrink: String!
        name: String!
        phone: String
        address: Address!
        id: ID!
    }

    type Query {
        personsCount: Int!
        allPersons(phone: YesNo): [Person]!
        findPerson(name: String!): Person
        allAddresses: [Address]!
    }

    type Mutation {
        addPerson(
            name: String!
            phone: String
            street: String!
            city: String!
        ): Person

        editNumber(name: String!, phone: String!): Person
    }
`

const resolvers = {
    Query: {
        personsCount: () => persons.length,
        allPersons: (root, args) => {
            // const personsFromRestApi = await fetch("http://localhost:5500/persons").then(res => res.json())

            if (!args.phone) return persons

            return persons.filter((person) => {
                return args.phone === 'YES' ? person.phone : !person.phone
            })
        },
        findPerson: (root, args) => {
            const { name } = args
            return persons.find((person) => person.name === name)
        },
        allAddresses: () => {
            return [
                ...persons.map((person) => ({
                    street: person.street,
                    city: person.city,
                })),
            ]
        },
    },
    Person: {
        // address: (root) => `${root.street}, ${root.city}`,
        address: (root) => {
            return {
                street: root.street,
                city: root.city,
            }
        },
        canDrink: (root) =>
            root.age ? (root.age > 18 ? 'Big Dick' : 'No bro') : "It's died",
    },
    Mutation: {
        addPerson: (root, args) => {
            if (persons.find((person) => person.name === args.name)) {
                throw new UserInputError('Name must be unique', {
                    invalidArgs: 'Error no valido',
                })
            }
            const person = { ...args, id: uuid() }
            persons.push(person)
            return person
        },
        editNumber: (root, args) => {
            const personIndex = persons.findIndex((p) => p.name === args.name)
            if (personIndex === -1) return null

            const person = persons[personIndex]
            const updatedPerson = { ...person, phone: args.phone }

            persons[personIndex] = updatedPerson
            return updatedPerson
        },
    },
}
const server = new ApolloServer({
    typeDefs,
    resolvers,
})

// server.listen(4000).then(({ url }) => {
// console.log(`Server ready at ${url}`)
// })
const { url } = await startStandaloneServer(server, {
    listen: 4000,
})

console.log(`runing Server at ${url}`)
