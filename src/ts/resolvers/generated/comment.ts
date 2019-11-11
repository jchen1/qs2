import { GraphQLContext } from '../../context'

// https://github.com/microsoft/TypeScript/issues/30858
import knex from 'knex';

export const commentResolvers = {
  Comment: {
    note: async (parent: any, _: any, context: GraphQLContext) => {
      const result = await context.db.select().from('note').where('id', '=', parent.noteId)
      return result[0]
    }
  },

  Query: {
    findComments: (_: any, args: any, context: GraphQLContext) => {
      return context.db.select().from('comment').where(args.fields)
    },
    findAllComments: (_: any, __: any, context: GraphQLContext) => {
      return context.db.select().from('comment')
    }
  },

  Mutation: {
    createComment: async (_: any, args: any, context: GraphQLContext) => {
      const result = await context.db('comment').insert(args.input).returning('*')
      return result[0]
    },
    updateComment: (_: any, args: any, context: GraphQLContext) => {
      return context.db('comment').where('id', '=' , args.id).update(args.input).then( async () => {
        const result = await context.db.select().from('comment').where('id', '=' , args.id);
        return result[0]
    })}
  }
}
