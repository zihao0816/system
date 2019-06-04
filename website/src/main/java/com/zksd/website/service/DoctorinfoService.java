/*
 * Powered By [zksd.cn]
 * Web Site: http://zksd.cn
 */
        /*
 * Powered By [zksd.cn]
 * Web Site: http://zksd.cn
 */
package com.zksd.website.service;



import com.zksd.website.entity.DoctorDetailsVo;

import java.util.List;
import java.util.Map;

/**
 * version 1.0
 * author zksd
 * date 2017-12-28 14:27:38
 *
 */


public interface DoctorinfoService{

     /**
      * 获取医生信息详情 包含技能、认证信息
      * @param id
      * @return
      */
     public DoctorDetailsVo getDoctorDetailsVoById(String id) throws Exception;

     List<Map<String,Object>> queryByCondition(Map<String, Object> var2);

}
