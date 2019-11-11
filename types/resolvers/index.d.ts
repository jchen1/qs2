export declare const resolvers: ({
    Comment: {
        note: (parent: any, _: any, context: import("../context").GraphQLContext) => Promise<any>;
    };
    Query: {
        findComments: (_: any, args: any, context: import("../context").GraphQLContext) => import("knex").QueryBuilder<unknown, {
            _base: unknown;
            _hasSelection: false;
            _keys: never;
            _aliases: {};
            _single: false;
            _intersectProps: {};
            _unionProps: never;
        }[]>;
        findAllComments: (_: any, __: any, context: import("../context").GraphQLContext) => import("knex").QueryBuilder<unknown, {
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
        createComment: (_: any, args: any, context: import("../context").GraphQLContext) => Promise<any>;
        updateComment: (_: any, args: any, context: import("../context").GraphQLContext) => Promise<any>;
    };
} | {
    Note: {
        comment: (parent: any, _: any, context: import("../context").GraphQLContext) => import("knex").QueryBuilder<unknown, {
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
        findNotes: (_: any, args: any, context: import("../context").GraphQLContext) => import("knex").QueryBuilder<unknown, {
            _base: unknown;
            _hasSelection: false;
            _keys: never;
            _aliases: {};
            _single: false;
            _intersectProps: {};
            _unionProps: never;
        }[]>;
        findAllNotes: (_: any, __: any, context: import("../context").GraphQLContext) => import("knex").QueryBuilder<unknown, {
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
        createNote: (_: any, args: any, context: import("../context").GraphQLContext) => Promise<any>;
        updateNote: (_: any, args: any, context: import("../context").GraphQLContext) => Promise<any>;
    };
})[];
