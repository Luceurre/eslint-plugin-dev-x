# eslint-plugin-dev-x

enforce good programming habits

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-dev-x`:

```sh
npm install eslint-plugin-dev-x --save-dev
```

## Usage

Add `dev-x` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "dev-x"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "dev-x/rule-name": 2
    }
}
```

## Supported Rules

* Fill in provided rules here


