/*
 * Powered By [zksd.cn]
 * Web Site: http://zksd.cn
 */
package com.zksd.website.entity;




/**
 * version 1.0
 * author zksd
 * date 2019-01-28 09:38:37
 * 
 */



@SuppressWarnings("serial")
public class Doctorinfo{
	

	//columns START
	private String id;
	private String doctorcode;
	private String doctorname;
	private String password;
	private String headphoto;
	private String qrsmallurl;
	private String qrbigurl;
	private Integer sex;
	private String birthday;
	private String hospitaid;
	private String department;
	private String duties;
	private String province;
	private String city;
	private String contry;
	private String address;
	private String telephone;
	private String phoneticode;
	private String fivecode;
	private String intro;
	private Integer isstick;
	private Integer ordernum;
	private Integer confirmstate;
	private String examineby;
	private String starttime;
	private String confirmtime;
	private String source;
	private String itaskprice;
	private String itasktime;
	private Integer itaskisopen;
	private String thaskprice;
	private String thasktime;
	private Integer thaskisopen;
	private String itagainprice;
	private String itagaintime;
	private Integer itagainisopen;
	private String thagainprice;
	private String thagaintime;
	private Integer thagainisopen;
	private String createby;
	private String createtime;
	private String updateby;
	private String updatetime;
	private String remark;
	private String setprice;
	private String openid;

	private String headimgurl;
	private String nickname;
	//columns END
	/*医生状态*/
	private String docstate;
	/*1,显示。2，隐藏*/
	private String websitestate;

	private Integer websiteranking;
	private String aftermedicalfee;
    private String orcodestatus;
    private String orderurl;

	//columns END


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

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getDoctorcode() {
		return doctorcode;
	}

	public void setDoctorcode(String doctorcode) {
		this.doctorcode = doctorcode;
	}

	public String getDoctorname() {
		return doctorname;
	}

	public void setDoctorname(String doctorname) {
		this.doctorname = doctorname;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getHeadphoto() {
		return headphoto;
	}

	public void setHeadphoto(String headphoto) {
		this.headphoto = headphoto;
	}

	public String getQrsmallurl() {
		return qrsmallurl;
	}

	public void setQrsmallurl(String qrsmallurl) {
		this.qrsmallurl = qrsmallurl;
	}

	public String getQrbigurl() {
		return qrbigurl;
	}

	public void setQrbigurl(String qrbigurl) {
		this.qrbigurl = qrbigurl;
	}

	public Integer getSex() {
		return sex;
	}

	public void setSex(Integer sex) {
		this.sex = sex;
	}

	public String getBirthday() {
		return birthday;
	}

	public void setBirthday(String birthday) {
		this.birthday = birthday;
	}

	public String getHospitaid() {
		return hospitaid;
	}

	public void setHospitaid(String hospitaid) {
		this.hospitaid = hospitaid;
	}

	public String getDepartment() {
		return department;
	}

	public void setDepartment(String department) {
		this.department = department;
	}

	public String getDuties() {
		return duties;
	}

	public void setDuties(String duties) {
		this.duties = duties;
	}

	public String getProvince() {
		return province;
	}

	public void setProvince(String province) {
		this.province = province;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getContry() {
		return contry;
	}

	public void setContry(String contry) {
		this.contry = contry;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getTelephone() {
		return telephone;
	}

	public void setTelephone(String telephone) {
		this.telephone = telephone;
	}

	public String getPhoneticode() {
		return phoneticode;
	}

	public void setPhoneticode(String phoneticode) {
		this.phoneticode = phoneticode;
	}

	public String getFivecode() {
		return fivecode;
	}

	public void setFivecode(String fivecode) {
		this.fivecode = fivecode;
	}

	public String getIntro() {
		return intro;
	}

	public void setIntro(String intro) {
		this.intro = intro;
	}

	public Integer getIsstick() {
		return isstick;
	}

	public void setIsstick(Integer isstick) {
		this.isstick = isstick;
	}

	public Integer getOrdernum() {
		return ordernum;
	}

	public void setOrdernum(Integer ordernum) {
		this.ordernum = ordernum;
	}

	public Integer getConfirmstate() {
		return confirmstate;
	}

	public void setConfirmstate(Integer confirmstate) {
		this.confirmstate = confirmstate;
	}

	public String getExamineby() {
		return examineby;
	}

	public void setExamineby(String examineby) {
		this.examineby = examineby;
	}

	public String getStarttime() {
		return starttime;
	}

	public void setStarttime(String starttime) {
		this.starttime = starttime;
	}

	public String getConfirmtime() {
		return confirmtime;
	}

	public void setConfirmtime(String confirmtime) {
		this.confirmtime = confirmtime;
	}

	public String getSource() {
		return source;
	}

	public void setSource(String source) {
		this.source = source;
	}

	public String getItaskprice() {
		return itaskprice;
	}

	public void setItaskprice(String itaskprice) {
		this.itaskprice = itaskprice;
	}

	public String getItasktime() {
		return itasktime;
	}

	public void setItasktime(String itasktime) {
		this.itasktime = itasktime;
	}

	public Integer getItaskisopen() {
		return itaskisopen;
	}

	public void setItaskisopen(Integer itaskisopen) {
		this.itaskisopen = itaskisopen;
	}

	public String getThaskprice() {
		return thaskprice;
	}

	public void setThaskprice(String thaskprice) {
		this.thaskprice = thaskprice;
	}

	public String getThasktime() {
		return thasktime;
	}

	public void setThasktime(String thasktime) {
		this.thasktime = thasktime;
	}

	public Integer getThaskisopen() {
		return thaskisopen;
	}

	public void setThaskisopen(Integer thaskisopen) {
		this.thaskisopen = thaskisopen;
	}

	public String getItagainprice() {
		return itagainprice;
	}

	public void setItagainprice(String itagainprice) {
		this.itagainprice = itagainprice;
	}

	public String getItagaintime() {
		return itagaintime;
	}

	public void setItagaintime(String itagaintime) {
		this.itagaintime = itagaintime;
	}

	public Integer getItagainisopen() {
		return itagainisopen;
	}

	public void setItagainisopen(Integer itagainisopen) {
		this.itagainisopen = itagainisopen;
	}

	public String getThagainprice() {
		return thagainprice;
	}

	public void setThagainprice(String thagainprice) {
		this.thagainprice = thagainprice;
	}

	public String getThagaintime() {
		return thagaintime;
	}

	public void setThagaintime(String thagaintime) {
		this.thagaintime = thagaintime;
	}

	public Integer getThagainisopen() {
		return thagainisopen;
	}

	public void setThagainisopen(Integer thagainisopen) {
		this.thagainisopen = thagainisopen;
	}

	public String getCreateby() {
		return createby;
	}

	public void setCreateby(String createby) {
		this.createby = createby;
	}

	public String getCreatetime() {
		return createtime;
	}

	public void setCreatetime(String createtime) {
		this.createtime = createtime;
	}

	public String getUpdateby() {
		return updateby;
	}

	public void setUpdateby(String updateby) {
		this.updateby = updateby;
	}

	public String getUpdatetime() {
		return updatetime;
	}

	public void setUpdatetime(String updatetime) {
		this.updatetime = updatetime;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getSetprice() {
		return setprice;
	}

	public void setSetprice(String setprice) {
		this.setprice = setprice;
	}

	public String getOpenid() {
		return openid;
	}

	public void setOpenid(String openid) {
		this.openid = openid;
	}

	public String getHeadimgurl() {
		return headimgurl;
	}

	public void setHeadimgurl(String headimgurl) {
		this.headimgurl = headimgurl;
	}

	public String getNickname() {
		return nickname;
	}

	public void setNickname(String nickname) {
		this.nickname = nickname;
	}

	public String getDocstate() {
		return docstate;
	}

	public void setDocstate(String docstate) {
		this.docstate = docstate;
	}

	public String getWebsitestate() {
		return websitestate;
	}

	public void setWebsitestate(String websitestate) {
		this.websitestate = websitestate;
	}

	public Integer getWebsiteranking() {
		return websiteranking;
	}

	public void setWebsiteranking(Integer websiteranking) {
		this.websiteranking = websiteranking;
	}

	public String getAftermedicalfee() {
		return aftermedicalfee;
	}

	public void setAftermedicalfee(String aftermedicalfee) {
		this.aftermedicalfee = aftermedicalfee;
	}
}

