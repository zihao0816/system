package com.zksd.website.entity;

import java.util.List;
import java.util.Map;

public class DoctorDetailsVo extends Doctorinfo {
	
	private static final long serialVersionUID = 1L;

	private String hospitacode;//所属医院编码
	
	private String hospitaname;//所属医院名称
	
	private String hospitashortname;//所属医院简称
	
	private String departmentname;//科室名称
	
	private String dutiesname;//职称名称
	
	private List<Map<String,Object>> doctorskillList;//技能信息 显示
	
	private List<Map<String,Object>> doctorqualificationList;//认证资料 显示
	
	private String dskills;
	
	private String dcertificate;
	
	private String userId;
	
	private String thagainpriceid;
	
	

	public String getThagainpriceid() {
		return thagainpriceid;
	}

	public void setThagainpriceid(String thagainpriceid) {
		this.thagainpriceid = thagainpriceid;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public void setDcertificate(String dcertificate) {
		this.dcertificate = dcertificate;
	}

	public String getDskills() {
		return dskills;
	}

	public void setDskills(String dskills) {
		this.dskills = dskills;
	}

	public String getDcertificate() {
		return dcertificate;
	}

	public void setDcertificate1(String dcertificate) {
		this.dcertificate = dcertificate;
	}

	
	public String getHospitacode() {
		return hospitacode;
	}

	public void setHospitacode(String hospitacode) {
		this.hospitacode = hospitacode;
	}

	public String getHospitaname() {
		return hospitaname;
	}

	public void setHospitaname(String hospitaname) {
		this.hospitaname = hospitaname;
	}

	public String getHospitashortname() {
		return hospitashortname;
	}

	public void setHospitashortname(String hospitashortname) {
		this.hospitashortname = hospitashortname;
	}

	public String getDepartmentname() {
		return departmentname;
	}

	public void setDepartmentname(String departmentname) {
		this.departmentname = departmentname;
	}

	public String getDutiesname() {
		return dutiesname;
	}

	public void setDutiesname(String dutiesname) {
		this.dutiesname = dutiesname;
	}

	public List<Map<String, Object>> getDoctorskillList() {
		return doctorskillList;
	}

	public void setDoctorskillList(List<Map<String, Object>> doctorskillList) {
		this.doctorskillList = doctorskillList;
	}

	public List<Map<String, Object>> getDoctorqualificationList() {
		return doctorqualificationList;
	}

	public void setDoctorqualificationList(List<Map<String, Object>> doctorqualificationList) {
		this.doctorqualificationList = doctorqualificationList;
	}
	
	
	


}
