#!/usr/bin/env node
import { program } from 'commander';
import genDiff from '../index.js';

program
  .name('gendiff')
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0')
  .option('-f, --format <type>', 'output format', 'stylish')
  .arguments('<filepath1> <filepath2>')
  .action((filePath1, filePath2) => {
    const format = `${program.opts().format}`;
    console.log(genDiff(filePath1, filePath2, format));
  });

program.parse();
