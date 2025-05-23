

```shell
yq eval ./pages/sidebar/sidebar.view.yaml -o=json -P >  ./pages/sidebar/sidebar.view.js && sed -i '' '1s/^/export default /' ./pages/sidebar/sidebar.view.js
```

```
for file in template.*; do
  mv "$file" "${file/template/resources}"
done

sed -i '' 's/template/resources/g' template.js
```

