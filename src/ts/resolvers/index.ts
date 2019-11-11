import { commentResolvers } from './generated/comment';
import { noteResolvers } from './generated/note';

// https://github.com/microsoft/TypeScript/issues/30858
import knex from 'knex';

export const resolvers = [commentResolvers, noteResolvers];
