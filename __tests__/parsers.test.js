import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs';
import { expect, test } from '@jest/globals';
import yaml from 'js-yaml';
import parse from '../src/parsers.js';
