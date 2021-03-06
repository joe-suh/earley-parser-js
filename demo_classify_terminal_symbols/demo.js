function init() {

    // Define grammar
    var grammar = new tinynlp.Grammar([
        'R -> S',
        'S -> S add_sub M | M | num',
        'M -> M mul_div T | T | num',
        'T -> num',
    ]);

    // Define function, which will classify tokens into terminal types
    grammar.terminalSymbols = function( token ) {
        if( '+' === token || '-' === token ) return ['add_sub'];
        if( '*' === token || '/' === token ) return ['mul_div'];
        if( token.match(/^\d+$/) ) return ['num'];
        throw new Error("Can't recognize token: " + token);
    }

    // You have to tokenize input by yourself!
    var tokens = '2 + 3 * 4'.split(' ');
    var rootRule = 'R';

    // Parsing
    var chart = tinynlp.parse(tokens, grammar, rootRule);

    console.log('\n')

    // Get array with all parsed trees
    var trees =  chart.getFinishedRoot(rootRule).traverse();

    // Iterate over all parsed trees and display them on HTML page
    for (var i in trees) {
        console.log(JSON.stringify(trees[i]))
        document.body.innerHTML += '<div class="tree" id="displayTree"><ul>' + displayTree(trees[i]) + '</ul></div></br>'
    }

    function displayTree(tree) {
        if (!tree.subtrees || tree.subtrees.length == 0) {
            return '<li><a href="#">' + tree.root + '</a></li>';
        }
        var builder = [];
        builder.push('<li><a href="#">');
        builder.push(tree.root);
        builder.push('</a>')
        builder.push('<ul>')
        for (var i in tree.subtrees) {
            builder.push(displayTree(tree.subtrees[i]))
        }
        builder.push('</ul>')
        builder.push('</li>')
        return builder.join('');
    }
}
