# 城市数据的思考

- 后台给的数据结构是

```js
[
    {
        "child": [
            { 
                "id": "430000",
                "name": "湖南省",
                "deep": "1",
                "parent_id": "0",
                "child": [
                    {
                        "id": "430100",
                        "name": "长沙市",
                        "deep": "2",
                        "parent_id": "430000",
                        "child": []
                    },
                ] 
            }
        ]
    }
]
```

- 想要的数据结构

```js

// 省级数据
1. provinceData: ["浙江", "江苏"]

// 还是

2. provinceData: [
    { id: 'xxxx', name: '浙江' }
]

// 市级数据

1. cityData: {
    '浙江': ["杭州", "..."],
    '江苏': ["南京", "..."]
}

2. cityData: {
    '浙江': [
        { id: 'xxx', name: '杭州' }
    ]
}

3. cityData: [
    { 
        parentId: 'xxx', 
        childList: [
            { id: 'xxx', name: 'xxxx' }
        ] 
    }
]
```
