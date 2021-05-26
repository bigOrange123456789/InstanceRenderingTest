package com.fanxb.bookmark.common.util;

import com.alibaba.fastjson.JSON;
import com.fanxb.bookmark.common.constant.RedisConstant;
import com.fanxb.bookmark.common.entity.User;
import com.fanxb.bookmark.common.entity.redis.UserBookmarkUpdate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

/**
 * 类功能简述：
 * 类功能详述：
 *
 * @author fanxb
 * @date 2019/3/8 13:26
 */
@Component
public class RedisUtil {
    private static final int DEFAULT_EXPIRE_TIME = 60 * 1000;

    private static final String STRING_TYPE_NAME = "java.lang.Class";

    public static StringRedisTemplate redisTemplate;

    @Autowired
    public void setRedisTemplate(StringRedisTemplate redisTemplate) {
        RedisUtil.redisTemplate = redisTemplate;
    }

    /**
     * 设置键值对，使用默认过期时间
     *
     * @param key   键
     * @param value 值
     */
    public static void set(String key, String value) {
        set(key, value, DEFAULT_EXPIRE_TIME);
    }

    /**
     * 设置键值对，指定过期时间
     *
     * @param key        key
     * @param value      value
     * @param expireTime 过期时间,ms
     */
    public static void set(String key, String value, long expireTime) {
        redisTemplate.opsForValue().set(key, value, expireTime, TimeUnit.MILLISECONDS);
    }

    /**
     * 删除key
     *
     * @param key key
     */
    public static void delete(String key) {
        redisTemplate.delete(key);
    }

    /**
     * Description: 获取对象
     *
     * @param key 键
     * @param tt  对象类
     * @return T
     * @author fanxb
     * @date 2019/4/12 10:45
     */
    @SuppressWarnings("unchecked")
    public static <T> T get(String key, Class<T> tt) {
        String str = redisTemplate.opsForValue().get(key);
        if (StringUtil.isEmpty(str)) {
            return null;
        } else {
            if (STRING_TYPE_NAME.equals(tt.getTypeName())) {
                return (T) str;
            } else {
                return JSON.parseObject(str, tt);
            }
        }
    }

    /**
     * 功能描述:推一条数据到mq队列中
     *
     * @param topic 队列名
     * @param obj   数据
     * @author 123
     * @date 2020/3/24 14:32
     */
    public static void addToMq(String topic, Object obj) {
        String data;
        if (obj instanceof String) {
            data = (String) obj;
        } else {
            data = JSON.toJSONString(obj);
        }
        redisTemplate.opsForList().leftPush(topic, data);
    }
}
