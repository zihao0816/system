/*
 * Powered By [zksd.cn]
 * Web Site: http://zksd.cn
 */
package com.zksd.website.dao;


import com.zksd.website.entity.DoctorDetailsVo;
import com.zksd.website.entity.Doctorinfo;

import java.util.List;
import java.util.Map;

/**
 * version 1.0
 * author zksd
 * date 2019-01-28 09:38:37
 * 
 */

public interface DoctorinfoMapper{
    List<Map<String,Object>> getDoctorinf(Map<String, Object> map) ;

    String getDuties(Map<String, Object> map) ;

    List<Map<String,Object>> getDoctorSkillName(Map<String,Object> map);

    /**
     * 查询医生详细信息 包含技能、认证资料
     * @param id
     * @return
     */
    public DoctorDetailsVo getDoctorDetailsById(String id);

    /**
     * 查询认证信息
     */
    public List<Map<String,Object>> doctorqualificationMapper(Map<String, Object> map);

    /**
     * 分页查询
     * @param map
     * @returnqueryByCondition
     */
    List<Map<String,Object>> queryByCondition(Map<String, Object> map) ;

    /**
     * 查询文章
     */
    List<Map<String,Object>> queryArticle(Map<String, Object> map) ;
}
