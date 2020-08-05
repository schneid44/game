# total

> [![Build Status](https://travis-ci.org/AlvaroBernalG/total.svg?branch=master)](https://travis-ci.org/AlvaroBernalG/total) [![npm version](https://badge.fury.io/js/total.svg)](https://badge.fury.io/js/total)

## Install

```shell
npm install total -g
```

# Disclaimer

This project is highly experimental and under development.

# List of commands

* [size](#size)
* [tp](#tp)
* [eval](#eval)

## size

File size.

### Usage

[ ] Takes a list of file paths and return the total size:

```shell
$ find . -name '*.js' | total size
22969
```

`-u [kb|mb|gb]` Transform the result in the specified size unit.

```shell
$ find . -name '*.js' | total size -u mb
22.969
```

`-p` Additional path lookup using glob patterns.

```shell
$ ls '*.js' | total size -p "./node_modules/**/*.ts"
6666666666666666666666666666
```

## tp

Text processor.

### Usage

[ ] Returns the number of characters

```shell
$ echo 'hello\nworld' | total tp
13
```

`-L` Returns the length of the longest line

```shell
$ echo 'hello\nworld' |  total tp -L
5
```

`-l` Returns the number of lines

```shell
$ echo 'hello\nworld' |  total tp -l
2
```

`-w` Returns the number of words

```shell
$ cat text.txt
hello world
$ total tp -w < text.txt
2
```

## eval

Evaluates stdin in a javascript environment.

### Usage

```shell
$ echo 'hello' | total eval -f 'stidn => stdin + " world"'
hello world
```

## Contributing

All contributions are welcome.

## License

MIT © [Alvaro Bernal](https://github.com/AlvaroBernalG/)
