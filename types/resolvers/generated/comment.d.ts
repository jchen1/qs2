import { GraphQLContext } from '../../context';
export declare const commentResolvers: {
    Comment: {
        note: (parent: any, _: any, context: GraphQLContext) => Promise<any>;
    };
    Query: {
        findComments: (_: any, args: any, context: GraphQLContext) => import("knex").QueryBuilder<unknown, {
            _base: unknown;
            _hasSelection: false;
            _keys: never;
            _aliases: {};
            _single: false;
            _intersectProps: {};
            _unionProps: never;
        }[]>;
        findAllComments: (_: any, __: any, context: GraphQLContext) => import("knex").QueryBuilder<unknown, {
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
        createComment: (_: any, args: any, context: GraphQLContext) => Promise<any>;
        updateComment: (_: any, args: any, context: GraphQLContext) => Promise<any>;
    };
};
