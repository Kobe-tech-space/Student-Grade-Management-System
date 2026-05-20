package com.stms.mapper;

import com.stms.model.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * 用户 Mapper 接口
 */
@Mapper
public interface UserMapper {

    /**
     * 根据用户名查询用户
     * @param username 用户名
     * @return 用户实体，未找到返回 null
     */
    User selectByUsername(@Param("username") String username);

    /**
     * 根据用户 ID 查询
     */
    User selectById(@Param("id") Integer id);

    /**
     * 更新用户密码（用于密码初始化）
     */
    int updatePassword(User user);
}
