/*
 * Powered By [zksd.cn]
 * Web Site: http://zksd.cn
 */
package com.zksd.website.entity;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;


/**
 * version 1.0
 * author zksd
 * date 2019-04-17 14:26:17
 * 
 */



@SuppressWarnings("serial")
public class Article{


	//columns START
    private String id;
	private String title;
	private String subtitle;
	private String classify;
	private String isshow;
	private java.util.Date updatetime;
	private String type;
	private String weight;
	private java.util.Date creatime;
	private String context;
	private String coverurl;
	private String state;
	private String label;
	private String isstick;
	private String covercolour;
	//columns END


	public String getIsstick() {
		return isstick;
	}

	public void setIsstick(String isstick) {
		this.isstick = isstick;
	}

	public String getCovercolour() {
		return covercolour;
	}

	public void setCovercolour(String covercolour) {
		this.covercolour = covercolour;
	}

	public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
		return this.title;
	}

	public void setTitle(String value) {
		this.title = value;
	}

	public String getSubtitle() {
		return this.subtitle;
	}

	public void setSubtitle(String value) {
		this.subtitle = value;
	}

	public String getClassify() {
		return this.classify;
	}

	public void setClassify(String value) {
		this.classify = value;
	}

	public String getIsshow() {
		return this.isshow;
	}

	public void setIsshow(String value) {
		this.isshow = value;
	}

	public java.util.Date getUpdatetime() {
		return this.updatetime;
	}

	public void setUpdatetime(java.util.Date value) {
		this.updatetime = value;
	}

	public String getType() {
		return this.type;
	}

	public void setType(String value) {
		this.type = value;
	}

	public String getWeight() {
		return this.weight;
	}

	public void setWeight(String value) {
		this.weight = value;
	}

	public java.util.Date getCreatime() {
		return this.creatime;
	}

	public void setCreatime(java.util.Date value) {
		this.creatime = value;
	}

	public String getContext() {
		return this.context;
	}

	public void setContext(String value) {
		this.context = value;
	}

	public String getCoverurl() {
		return this.coverurl;
	}

	public void setCoverurl(String value) {
		this.coverurl = value;
	}

	public String getState() {
		return this.state;
	}

	public void setState(String value) {
		this.state = value;
	}

	public String getLabel() {
		return this.label;
	}

	public void setLabel(String value) {
		this.label = value;
	}
	
/**
 * 序列�?
 */
private static final long serialVersionUID = 1L;

	public String toString() {
		return new ToStringBuilder(this)
			.append("Id",getId())
			.append("Title",getTitle())
			.append("Subtitle",getSubtitle())
			.append("Classify",getClassify())
			.append("Isshow",getIsshow())
			.append("Updatetime",getUpdatetime())
			.append("Type",getType())
			.append("Weight",getWeight())
			.append("Creatime",getCreatime())
			.append("Context",getContext())
			.append("Coverurl",getCoverurl())
			.append("State",getState())
			.append("Label",getLabel())
			.toString();
	}
	
	public int hashCode() {
		return new HashCodeBuilder()
			.append(getId())
			.append(getTitle())
			.append(getSubtitle())
			.append(getClassify())
			.append(getIsshow())
			.append(getUpdatetime())
			.append(getType())
			.append(getWeight())
			.append(getCreatime())
			.append(getContext())
			.append(getCoverurl())
			.append(getState())
			.append(getLabel())
			.toHashCode();
	}
	
	public boolean equals(Object obj) {
		if(obj instanceof Article == false) return false;
		if(this == obj) return true;
		Article other = (Article)obj;
		return new EqualsBuilder()
			.append(getId(),other.getId())
			.append(getTitle(),other.getTitle())
			.append(getSubtitle(),other.getSubtitle())
			.append(getClassify(),other.getClassify())
			.append(getIsshow(),other.getIsshow())
			.append(getUpdatetime(),other.getUpdatetime())
			.append(getType(),other.getType())
			.append(getWeight(),other.getWeight())
			.append(getCreatime(),other.getCreatime())
			.append(getContext(),other.getContext())
			.append(getCoverurl(),other.getCoverurl())
			.append(getState(),other.getState())
			.append(getLabel(),other.getLabel())
			.isEquals();
	}
}

