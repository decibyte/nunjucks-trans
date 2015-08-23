function TranslateExtension() {
    this.tags = ['trans'];

    this.parse = function(parser, nodes, lexer) {
        var token = parser.nextToken();
        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(token.value);
        var body = parser.parseUntilBlocks('endtrans');
        parser.advanceAfterBlockEnd();
        var run = args.children.length ? 'runWithArgs' : 'runWithoutArgs';
        return new nodes.CallExtension(this, run, args, [body]);
    }

    this.runWithoutArgs = function(context, body) {
        return gettext(body());
    }

    this.runWithArgs = function(context, args, body) {
        // How do I avoid polluting the global context?
        // <https://github.com/mozilla/nunjucks/issues/497>
        for (key in args) {
            if ('__keywords' != key) {
                context.ctx[key] = args[key];
            }
        }
        return gettext(body());
    }
}
