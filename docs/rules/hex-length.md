# Hex Length

Rule `hex-length` will enforce the length of hexadecimal values

## Options

* `style`: `short`/`long` (defaults to `short`)

## Examples

When `style: short`, the following are allowed. When `style: long`, the following are disallowed:

```scss
$foo-color: #456;

.bar {
  background: linear-gradient(top, #3ff, #ddd);
}

.baz {
  color: #fff;
}
```

When `style: long`, the following are allowed. When `style: short`, the following are disallowed:

```scss
$foo-color: #456456;

.bar {
  background: linear-gradient(top, #3ff3ff, #dddddd);
}

.baz {
  color: #ffffff;
}
```
