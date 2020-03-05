# processInfo 实例详情
```json
{
    "code":"0",
    "message":"success",
    "data":{
        "id":"1235125396043862016",
        "name":"歌词册",
        "description":"<p></p>",
        "status":"1",
        "create_user_id":"1135840292222668800",
        "create_user_name":"",
        "create_user_avatar":"",
        "create_time":"1583311817",
        "content_link":"1235125396056444928",
        "curr_node_id":"1235125396056444928",
        "nodes":[
            {
                "id":"1235125396056444928",
                "name":"LAST DANCE",
                "description":"",
                "node_type":"1",
                "deadlined_timeout":"0",
                "assignee_type":"1",
                "assignees":[

                ],
                "transfer_mode":"2",
                "enable_revocation":"1",
                "enable_opinion":"1",
                "sort":"1",
                "content_link":[

                ]
            }
        ],
        "completed_amount":"0",
        "node_amount":"1",
        "is_privilege":"0",
        "privileges":[

        ],
        "privileges_extend":[

        ],
        "is_shared":"0"
    }
}
```

# processTemplateList 模板列表
```json
{
    "code":"0",
    "message":"success",
    "data":[
        {
            "id":"1235125380650766336",
            "name":"歌词册",
            "versions":"1",
            "template_no":"1235125380650766337",
            "board_id":"1235125250149191680",
            "user_id":"1135840292222668800",
            "is_retain":"1",
            "is_new_version":"1",
            "create_time":"1583311813",
            "update_time":"1583311813",
            "flow_template_node_list":[
                {
                    "id":"1235125380671737856",
                    "template_id":"1235125380650766336",
                    "flow_node_type":"1",
                    "name":"LAST DANCE",
                    "description":"",
                    "assignee_type":"1",
                    "assignees":"",
                    "cc_type":"1",
                    "transfer_mode":"2",
                    "enable_revocation":"1",
                    "enable_opinion":"1",
                    "create_time":"1583311813",
                    "update_time":"1583311813",
                    "sort":"1"
                }
            ]
        }
    ]
}
```

# processDoingList | processStopedList | processComepletedList | processNotBeginningList
```json
{
    "code":"0",
    "message":"success",
    "data":[
        {
            "is_privilege":"0",
            "privileges":[

            ],
            "id":"1235125396043862016",
            "flow_template_id":"1235125380650766336",
            "board_id":"1235125250149191680",
            "name":"歌词册",
            "description":"<p></p>",
            "status":"1",
            "proc_ins_id":"610075",
            "proc_def_id":"process1235125380650766336:1:610074",
            "create_by":"1135840292222668800",
            "curr_node_id":"1235125396056444928",
            "create_time":"1583311817",
            "update_time":"1583311817",
            "total_node_num":"0",
            "completed_node_num":"0"
        }
    ]
}
```