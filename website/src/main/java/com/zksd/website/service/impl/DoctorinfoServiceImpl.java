/*
 * Powered By [zksd.cn]
 * Web Site: http://zksd.cn
 */
/*
 * Powered By [zksd.cn]
 * Web Site: http://zksd.cn
 */
package com.zksd.website.service.impl;


import com.zksd.website.dao.DoctorinfoMapper;
import com.zksd.website.entity.DoctorDetailsVo;
import com.zksd.website.service.DoctorinfoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * version 1.0
 * author zksd
 * date 2017-12-28 14:32:23
 *
 */


@Service("doctorinfoService")
public class DoctorinfoServiceImpl  implements DoctorinfoService {
	private static Logger logger = LoggerFactory.getLogger(DoctorinfoServiceImpl.class);
	@Autowired
	private DoctorinfoMapper doctorinfoMapper;

	/**
	 * 获取医生信息详情 包含技能、认证信息
	 *
	 * @param id
	 * @return
	 */
	@Override
	public DoctorDetailsVo getDoctorDetailsVoById(String id) throws Exception {
		// 查询医生基本信息
		DoctorDetailsVo doctorDetailsVo = doctorinfoMapper.getDoctorDetailsById(id);
		if (null==doctorDetailsVo)return null;
		// 查询医生技能信息
		Map<String, Object> con = new HashMap<>();
		con.put("doctorid", id);
		List<Map<String, Object>> doctorskillList = doctorinfoMapper.getDoctorSkillName(con);
		doctorDetailsVo.setDoctorskillList(doctorskillList);

		// 查询医生认证资料
		List<Map<String, Object>> doctorqualificationList = doctorinfoMapper.doctorqualificationMapper(con);
		doctorDetailsVo.setDoctorqualificationList(doctorqualificationList);

		return doctorDetailsVo;
	}


	public List<Map<String,Object>> queryByCondition(Map<String, Object> param) {
		List<Map<String, Object>> result =doctorinfoMapper.queryByCondition(param);
		return result;
	}
}
