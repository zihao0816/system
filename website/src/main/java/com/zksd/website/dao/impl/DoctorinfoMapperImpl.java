/*
 * Powered By [zksd.cn]
 * Web Site: http://zksd.cn
 */
package com.zksd.website.dao.impl;


import com.zksd.website.dao.DoctorinfoMapper;
import com.zksd.website.entity.DoctorDetailsVo;
import com.zksd.website.entity.Doctorinfo;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.support.SqlSessionDaoSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

/**
 * version 1.0
 * author zksd
 * date 2019-01-28 09:38:37
 * 
 */

@Repository("doctorinfoMapper")
public class DoctorinfoMapperImpl extends SqlSessionDaoSupport implements DoctorinfoMapper {
    private static Logger logger = LoggerFactory.getLogger(DoctorinfoMapperImpl.class);

    @Resource
    public void setSqlSessionFactory(SqlSessionFactory sqlSessionFactory){
        super.setSqlSessionFactory(sqlSessionFactory);
    }
    @Override
    public List<Map<String,Object>> getDoctorinf(Map<String, Object> map) {
        return getSqlSession().selectList("doctorinfo.getListByKey", map);
    }

    @Override
    public String getDuties(Map<String, Object> map) {
        return getSqlSession().selectOne("doctorinfo.getDuties", map);

    }

    @Override
    public List<Map<String, Object>> getDoctorSkillName(Map<String, Object> map) {
        return  this.getSqlSession().selectList("doctorinfo.getDoctorSkillName", map);
    }

    /**
     * 查询医生详细信息 包含技能、认证资料
     * @param id
     * @return
     */
    public DoctorDetailsVo getDoctorDetailsById(String id)
    {
        return getSqlSession().selectOne("doctorinfo.selectDoctorDetailsById",id);
    }

    @Override
    public List<Map<String, Object>> doctorqualificationMapper(Map<String, Object> map) {
        return  this.getSqlSession().selectList("doctorinfo.doctorqualificationMapper", map);

    }

    @Override
    public List<Map<String, Object>> queryByCondition(Map<String, Object> map) {
        return getSqlSession().selectList("doctorinfo.queryByCondition", map);
    }

    @Override
    public List<Map<String, Object>> queryArticle(Map<String, Object> map) {
        return getSqlSession().selectList("doctorinfo.chaxunwenzhang", map);
    }
}
