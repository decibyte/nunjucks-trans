function TranslateExtension() {
    this.tags = ['trans'];

    this.pluralize = function(count, single, plural) {
        return gettext(parseInt(count) == 1 ? single() : plural());
    }

    this.parse = function(parser, nodes, lexer) {
        var token = parser.nextToken();
        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(token.value);
        var body = parser.parseUntilBlocks('endtrans', 'pluralize');
        var plural_body = null;
        if (parser.skipSymbol('pluralize')) {
            parser.skip(lexer.TOKEN_BLOCK_END);
            plural_body = parser.parseUntilBlocks('endtrans');
        }
        parser.advanceAfterBlockEnd();
        var run = args.children.length ? 'runWithArgs' : 'runWithoutArgs';
        return new nodes.CallExtension(this, run, args, [body, plural_body]);
    }

    this.runWithoutArgs = function(context, body, plural_body) {
        return gettext(body());
    }

    this.runWithArgs = function(context, args, body, plural_body) {
        // How do I avoid polluting the global context?
        // <https://github.com/mozilla/nunjucks/issues/497>
        for (key in args) {
            if ('__keywords' != key) {
                context.ctx[key] = args[key];
            }
        }
        if ('count' in args) {
            return this.pluralize(args['count'], body, plural_body);
        } else {
            return gettext(body());
        }
    }
}
