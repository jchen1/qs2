import { GraphQLContext } from '../../context';
export declare const noteResolvers: {
    Note: {
        comment: (parent: any, _: any, context: GraphQLContext) => import("knex").QueryBuilder<unknown, {
            _base: unknown;
            _hasSelection: false;
            _keys: never;
            _aliases: {};
            _single: false;
            _intersectProps: {};
            _unionProps: never;
        }[]>;
    };
    Query: {
        findNotes: (_: any, args: any, context: GraphQLContext) => import("knex").QueryBuilder<unknown, {
            _base: unknown;
            _hasSelection: false;
            _keys: never;
            _aliases: {};
            _single: false;
            _intersectProps: {};
            _unionProps: never;
        }[]>;
        findAllNotes: (_: any, __: any, context: GraphQLContext) => import("knex").QueryBuilder<unknown, {
            _base: unknown;
            _hasSelection: false;
            _keys: never;
            _aliases: {};
            _single: false;
            _intersectProps: {};
            _unionProps: never;
        }[]>;
    };
    Mutation: {
        createNote: (_: any, args: any, context: GraphQLContext) => Promise<any>;
        updateNote: (_: any, args: any, context: GraphQLContext) => Promise<any>;
    };
};
