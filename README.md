# Gendiff

### Hexlet tests and linter status:
[![Actions Status](https://github.com/NiyazGaripov/frontend-project-46/workflows/hexlet-check/badge.svg)](https://github.com/NiyazGaripov/frontend-project-46/actions)

## Description
Gendiff is a CLI tool that defines the difference between two files. This mechanism is used when testing or automatically tracking changes in configuration files.

### Functionality of the utility
- Support for different input formats: `yaml`, `json`
- Report generation as `plain text`, `stylish` and `json`

### Example of the use
```
# plain format
gendiff --format plain path/to/file.yml another/path/file.json

Property 'common.follow' was added with value: false
Property 'group1.baz' was updated. From 'bas' to 'bars'
Property 'group2' was removed

# stylish format
gendiff filepath1.json filepath2.json

{
  + follow: false
    setting1: Value 1
  - setting2: 200
  - setting3: true
  + setting3: {
        key: value
    }
  + setting4: blah blah
  + setting5: {
        key5: value5
    }
}
```
