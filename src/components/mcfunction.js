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
          'pattern': /((?<![\\])['"])((?:.(?!(?<![\\])\1))*.?)\1/,
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
      'pattern': /((?<![\\])['"])((?:.(?!(?<![\\])\1))*.?)\1/,
      'greedy': true
    }
  };