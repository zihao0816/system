package com.zksd.website.entity;

import java.io.Serializable;
import java.util.List;
import java.util.Map;
import java.util.Objects;

public class DoctorInfoVo implements Serializable {
	
	private static final long serialVersionUID = 1L;
	/**
	 * ID
	 */
	private String id;
	/**
	 * 头像
	 */
	private String headphoto;
	/**
	 * 二维码大图
	 */
	private String qrbigurl;
	/**
	 * 姓名
	 */
	private String doctorname;
	/**
	 * 职称/职务
	 */
	private String duties;
	/**
	 * 科室名称
	 */
	private String departmentname;
	/**
	 * 介绍
	 */
	private String intro;
	/**
	 * 擅长调理
	 */
	private String  skilled;
	private String hospitaname;//所属医院名称
	private String orcodestatus;
	private String orderurl;
	public DoctorInfoVo() {
	}

	public DoctorInfoVo(String id, String headphoto, String qrbigurl, String doctorname, String duties, String departmentname
			, String intro, String skilled,String hospitaname,String orcodestatus,String orderurl) {
		this.id = id;
		this.headphoto = headphoto;
		this.qrbigurl = qrbigurl;
		this.doctorname = doctorname;
		this.duties = duties;
		this.departmentname = departmentname;
		this.intro = intro;
		this.skilled = skilled;
		this.orcodestatus = orcodestatus;
		this.orderurl = orderurl;
	}

	public String getOrcodestatus() {
		return orcodestatus;
	}

	public void setOrcodestatus(String orcodestatus) {
		this.orcodestatus = orcodestatus;
	}

	public String getOrderurl() {
		return orderurl;
	}

	public void setOrderurl(String orderurl) {
		this.orderurl = orderurl;
	}

	public String getHospitaname() {
		return hospitaname;
	}

	public void setHospitaname(String hospitaname) {
		this.hospitaname = hospitaname;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getHeadphoto() {
		return headphoto;
	}

	public void setHeadphoto(String headphoto) {
		this.headphoto = headphoto;
	}

	public String getQrbigurl() {
		return qrbigurl;
	}

	public void setQrbigurl(String qrbigurl) {
		this.qrbigurl = qrbigurl;
	}

	public String getDoctorname() {
		return doctorname;
	}

	public void setDoctorname(String doctorname) {
		this.doctorname = doctorname;
	}

	public String getDuties() {
		return duties;
	}

	public void setDuties(String duties) {
		this.duties = duties;
	}

	public String getDepartmentname() {
		return departmentname;
	}

	public void setDepartmentname(String departmentname) {
		this.departmentname = departmentname;
	}

	public String getIntro() {
		return intro;
	}

	public void setIntro(String intro) {
		this.intro = intro;
	}

	public String getSkilled() {
		return skilled;
	}

	public void setSkilled(String skilled) {
		this.skilled = skilled;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		DoctorInfoVo that = (DoctorInfoVo) o;
		return Objects.equals(id, that.id);
	}

	@Override
	public int hashCode() {
		return Objects.hash(id);
	}

	@Override
	public String toString() {
		return "DoctorInfoVo{" +
				"id='" + id + '\'' +
				", headphoto='" + headphoto + '\'' +
				", qrbigurl='" + qrbigurl + '\'' +
				", doctorname='" + doctorname + '\'' +
				", duties='" + duties + '\'' +
				", departmentname='" + departmentname + '\'' +
				", intro='" + intro + '\'' +
				", skilled=" + skilled +
				'}';
	}
}
