CREATE TABLE `tb_ai` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `prompt` varchar(255) DEFAULT NULL,
  `answer` text,
  `created_at` datetime DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `tb_article` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `categories` varchar(255) DEFAULT NULL COMMENT '分类ID，格式: 1,2,3',
  `title` varchar(255) NOT NULL COMMENT '标题',
  `thumbnail_id` bigint(11) DEFAULT NULL COMMENT '缩略图ID ',
  `content` text COMMENT '内容',
  `description` text COMMENT '简介',
  `more` text COMMENT '扩展属性,如缩略图列表;格式为json',
  `created_at` datetime DEFAULT NULL COMMENT '提交时间',
  `updated_at` datetime DEFAULT NULL COMMENT '处理时间',
  `deleted_at` datetime DEFAULT NULL COMMENT '软删除时间',
  `status` bigint(11) DEFAULT '0' COMMENT '状态,0:未审核,1:已审核',
  `url` varchar(255) DEFAULT NULL COMMENT '链接',
  `tags_old` varchar(255) DEFAULT NULL COMMENT '标签，多个标签使用英文‘,’分割 ',
  `hit_counter` bigint(11) DEFAULT NULL COMMENT '点击次数',
  `list_order` bigint(11) DEFAULT NULL COMMENT '排序',
  `is_show` bigint(1) DEFAULT NULL COMMENT '是否显示 1 显示 0隐藏',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `thumbnail_id` (`thumbnail_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `tb_article_meta` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `article_id` bigint(20) NOT NULL,
  `meta_key` varchar(100) NOT NULL,
  `meta_value` longtext NOT NULL,
  PRIMARY KEY (`id`),
  KEY `article_id` (`article_id`),
  KEY `meta_key` (`meta_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `tb_article_to_category` (
  `article_id` bigint(20) NOT NULL,
  `category_id` bigint(20) NOT NULL,
  KEY `tb_portal_article_to_category_article_id_category_id` (`article_id`,`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `tb_article_to_tag` (
  `article_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL,
  KEY `article_id` (`article_id`),
  KEY `tag_id` (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `tb_asset` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL COMMENT '用户id',
  `parent_id` bigint(20) NOT NULL COMMENT '父id，比如相关文章的图片，非必填',
  `file_name` varchar(255) DEFAULT NULL COMMENT '文件名',
  `file_path` varchar(255) NOT NULL DEFAULT '' COMMENT '文件路径,相对于upload目录,可以为url',
  `file_size` bigint(20) NOT NULL COMMENT '文件大小,单位B',
  `suffix` varchar(255) NOT NULL DEFAULT '' COMMENT '文件后缀名,不包括点',
  `download_counter` bigint(20) DEFAULT '0' COMMENT '下载次数',
  `created_at` datetime NOT NULL COMMENT '创建时间',
  `more` text COMMENT '其它详细信息,JSON格式',
  `status` bigint(20) NOT NULL DEFAULT '1' COMMENT '状态;1:可用,0:不可用',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `tb_category` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `parent_id` bigint(20) NOT NULL DEFAULT '0',
  `user_id` bigint(20) DEFAULT NULL COMMENT '创建者ID',
  `title` varchar(50) NOT NULL,
  `description` text,
  `thumbnail` varchar(255) DEFAULT '',
  `thumbnail_id` bigint(20) DEFAULT NULL COMMENT '缩略图ID',
  `template` varchar(50) DEFAULT NULL COMMENT '模板',
  `per_page` int(11) DEFAULT NULL COMMENT '每页显示条数',
  `list_order` bigint(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `is_show` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `tb_code` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `code` varchar(25) COLLATE utf8_unicode_ci DEFAULT NULL,
  `account` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `is_used` int(11) DEFAULT NULL,
  `ip` varchar(128) COLLATE utf8_unicode_ci DEFAULT NULL,
  `flag` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `expired_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `tb_comment` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `from_user_id` bigint(20) NOT NULL COMMENT '评论者uuid',
  `to_user_id` bigint(20) DEFAULT NULL COMMENT '被评论者的uuid',
  `object_id` bigint(20) NOT NULL COMMENT '评论主题ID',
  `parent_id` bigint(20) NOT NULL DEFAULT '0' COMMENT '父评论ID',
  `content` text COMMENT '评论内容',
  `more` text COMMENT '扩展属性',
  `like_counter` bigint(11) DEFAULT NULL COMMENT '点赞次数',
  `dislike_counter` bigint(11) DEFAULT NULL COMMENT '被踩次数',
  `is_show` int(11) DEFAULT NULL COMMENT '是否删除',
  `created_at` bigint(11) DEFAULT NULL COMMENT '创建时间',
  `updated_at` bigint(11) DEFAULT NULL COMMENT '更新时间',
  `deleted_at` bigint(11) DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `tb_log` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL COMMENT '用户 ID',
  `ip` varchar(128) DEFAULT NULL COMMENT 'IP 地址',
  `action` varchar(50) NOT NULL COMMENT '操作名称，需要格式唯一',
  `count` bigint(20) NOT NULL COMMENT '当天的次数',
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `tb_page` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `title` varchar(255) NOT NULL,
  `thumbnail_id` varchar(255) DEFAULT NULL,
  `content` text NOT NULL,
  `description` text,
  `more` text,
  `template` varchar(255) DEFAULT NULL COMMENT '模板',
  `route_url` varchar(100) DEFAULT NULL COMMENT '路由地址',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `hit_counter` bigint(11) DEFAULT NULL,
  `is_show` bigint(11) DEFAULT NULL,
  `list_order` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `route_url` (`route_url`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `tb_tag` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `tag_title` varchar(50) NOT NULL COMMENT '标签名',
  `list_order` bigint(11) DEFAULT '99' COMMENT '排序',
  PRIMARY KEY (`id`,`tag_title`),
  UNIQUE KEY `tag_title` (`tag_title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `tb_unload` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `start` varchar(50) DEFAULT NULL,
  `end` varchar(50) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `tb_user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `nickname` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `mobile` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `password` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `gender` int(1) NOT NULL DEFAULT '0' COMMENT '0 保密、1 男、2 女',
  `birthday` bigint(11) DEFAULT NULL,
  `score` bigint(11) DEFAULT NULL,
  `coin` bigint(11) DEFAULT NULL,
  `balance` decimal(10,2) DEFAULT NULL,
  `avatar` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `signature` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `last_login_ip` varchar(15) COLLATE utf8_unicode_ci DEFAULT NULL,
  `more` text COLLATE utf8_unicode_ci,
  `address` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `type` int(1) NOT NULL DEFAULT '1' COMMENT '用户类型 0:超级管理员 1:普通用户',
  `created_at` datetime DEFAULT NULL,
  `logined_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `status` int(1) NOT NULL DEFAULT '1' COMMENT '用户状态 1:正常、0:禁用',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `tb_user_meta` (
  `user_meta_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `meta_key` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `meta_value` longtext COLLATE utf8_unicode_ci,
  PRIMARY KEY (`user_meta_id`),
  KEY `user_id` (`user_id`),
  KEY `meta_key` (`meta_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



