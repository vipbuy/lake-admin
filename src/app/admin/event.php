<?php
// 事件定义文件
return [
    'bind'      => [
    ],

    'listen'    => [
        'AppInit'  => [],
        'HttpRun'  => [],
        'HttpEnd'  => [
            // 操作记录
            '\\app\\admin\\listener\\AdminLog',
        ],
        'LogLevel' => [],
        'LogWrite' => [],
    
        // 自定义后台首页
        'LakeAdminMainUrl' => [
            // 自定义后台首页
            '\\app\\admin\\listener\\AdminMainUrl',
        ],
    ],

    'subscribe' => [
    ],
];
