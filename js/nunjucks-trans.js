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
        return gettext(body());
    }
}
