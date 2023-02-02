import Prism from 'prism-react-renderer/prism'

Prism.languages.mcfunction = {
    'comment': /(^[#]|\n#)(.+)/,
    'command': {
      'pattern': /(\srun\s)[a-z]+|((^|\n)(\/)?[a-z]+)/,
      'alias': 'operator',
      'inside': {
        'run': {
          'pattern': /\srun\s/,
          'alias': 'inserted'
        } 
      }
    },
    'selector': {
      'pattern': /@(a|e|p|r|s)(\[[^\s]+\])?/,
      'inside': {
        'punctuation': /(\{|\}|,|=|\[|\]|:)/,
        'boolean': /(true|false|0a|0b|1a|1b)/,
        'number': /([\^,~]?\d+(\.\d+)?)|[\^,~]/,
        'string': {
          'pattern': /"(?:\\.|[^"\\])*"/,
          'greedy': true
        }
      }
    },
    'execute': {
      'pattern': /\s(align|anchored|facing|as|at|in|positioned|rotated|if|unless|store)\s/,
      'alias': 'inserted'
    },
    'keyword': {
      'pattern': /\s(minecraft:)?[a-z,_]+(\s|\{)/,
      'inside': {
        'punctuation': /\{/
      }
    },
    'punctuation': /(\{|\}|,|=|\[|\]|:)/,
    'boolean': /(true|false|\d+b)/,
    'number': /([\^,~]?\d+(\.\d+)?(F|f)?)|[\^,~]/,
    'string': {
      'pattern': /"(?:\\.|[^"\\])*"/,
      'greedy': true
    }
};

Prism.languages.molang = {
    'string': /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
      'function-name': /\b(?!\d)math\.\w+(?=[\t ]*\()/i,
      'selector': /\b(?!\d)((query|variable|temp|context|math|q|v|t|c)\.\w+)|this/i,
      'boolean': /\b(?:true|false)\b/i,
    'number': /(?:\b\d+(?:\.\d+f?)?(?:[ed][+-]\d+)?|&h[a-f\d]+)\b/i,
    'operator': /&&|\|\||[-+*/!<>]=?|[:?=]/i,
    'keyword': /\b(return|loop|for_each|break|continue)\b/i,
    'punctuation': /[.,;()[\]{}]/,
};