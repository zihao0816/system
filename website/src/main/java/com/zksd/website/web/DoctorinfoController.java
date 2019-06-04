/*
 * Powered By [zksd.cn]
 * Web Site: http://zksd.cn
 */
package com.zksd.website.web;

import com.zksd.website.dao.DoctorinfoMapper;
import com.zksd.website.entity.Article;
import com.zksd.website.entity.DoctorDetailsVo;
import com.zksd.website.entity.DoctorInfoVo;

import com.zksd.website.service.DoctorinfoService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * version 1.0
 * author zksd
 * date 2019-01-28 09:38:37
 */

@RestController
//@RequestMapping(value = "/api/doctorinfo")
public class DoctorinfoController {
    @Autowired
    private DoctorinfoService doctorinfoService;
    @Autowired
    private DoctorinfoMapper doctorinfoMapper;
    //private String url = "http://localhost:8888";
    @Value("${url}")
    private String url;
    //private String url = "http://192.168.1.126:8888";
    @RequestMapping(value = "/login")
    public ModelAndView index(ModelAndView modelAndView) {
        modelAndView.setViewName("a");

        List<String> userList = new ArrayList<String>();
        userList.add("admin");
        userList.add("user1");
        userList.add("user2");

        modelAndView.addObject("userList", userList);
        return modelAndView;
    }

    /**
     * 网站获取医生列表
     *
     * @return
     * @throws Exception
     */
    @RequestMapping(value = {"/index.html", "/"})
    public Object getWebsiteList() throws Exception {
        ModelAndView modelAndView = new ModelAndView();
        List<Map<String, Object>> doctorList = new ArrayList<Map<String, Object>>();
        Map<String, Object> map = new HashMap<>();
        map.put("confirmstate", "1");
        map.put("websitestate", "1");
        map.put("orderby", "maintable.websiteranking desc limit 36");
        doctorList = doctorinfoMapper.getDoctorinf(map);
        for (int i = 0; i < doctorList.size(); i++) {
            Map<String, Object> mapskill;
            List<Map<String, Object>> list;
            Map map1 = doctorList.get(i);
            if (map1.get("duties") != null && StringUtils.isNotBlank(map1.get("duties").toString().trim())) {
                map1.put("duties", getDatadictionarydetail("zhicheng", map1.get("duties").toString()));
            }
            //整合擅长技能
            mapskill = new HashMap<>();
            mapskill.put("doctorid", map1.get("id"));
            list = doctorinfoMapper.getDoctorSkillName(mapskill);
            if (list.size() > 0) {
                map1.put("skillname", list.get(0).get("skillname") + "");
            }
        }
        modelAndView.setViewName("index");
        modelAndView.addObject("doctorList", doctorList);
        modelAndView.addObject("url", url);
        return modelAndView;
    }

    /**
     * 根据医生ID获取医生简介详情接口
     *
     * @param sortcode
     * @param itemcode
     * @return
     */
    @RequestMapping(value = "/detail/{doctorid}.html")
    public Object getDoctorInfoById(@PathVariable String doctorid) throws Exception {
        ModelAndView modelAndView = new ModelAndView();
//        HttpServletRequest request=RequestUtil.getRequest();
        DoctorInfoVo doctorInfoVo = null;
        try {
            DoctorDetailsVo temp = doctorinfoService.getDoctorDetailsVoById(doctorid);
            if (temp == null) {
                return "获取失败";
            }
            String dutie = getDatadictionarydetail("zhicheng", temp.getDuties());
            List<Map<String, Object>> skilled = temp.getDoctorskillList();

            doctorInfoVo = new DoctorInfoVo(temp.getId(), temp.getHeadphoto(), temp.getQrbigurl(), temp.getDoctorname(), dutie
                    , temp.getDepartmentname(), temp.getIntro(), skilled.get(0).get("skillname").toString(), temp.getHospitaname(), temp.getOrcodestatus(), temp.getOrderurl());
            doctorInfoVo.setHospitaname(temp.getHospitaname());
        } catch (Exception e) {
            /*logger.error("请求路径:" + request.getRequestURI().toString() + "操作失败。 \t错误原因:", e);*/
            e.printStackTrace();
            System.out.println(e.getMessage());
            return "操作失败";
        }
        System.out.println("doctorInfoVo" + doctorInfoVo);
        modelAndView.setViewName("detail");
        modelAndView.addObject("doctorInfoVo", doctorInfoVo);
        modelAndView.addObject("url", url);
        return modelAndView;
    }

    /**
     * 分页获取医生列表
     *
     * @param sortcode
     * @param itemcode
     * @return
     */

    @RequestMapping(value = "/list/{currPage}/{pageSize}.html")
    public Object list(@PathVariable Integer currPage, @PathVariable Integer pageSize) throws Exception {
        ModelAndView modelAndView = new ModelAndView();
        Map<String, Object> mapp = new HashMap<>();
        mapp.put("confirmstate", "1");
        mapp.put("websitestate", "1");
        mapp.put("orderby", "maintable.websiteranking desc");
        mapp.put("currIndex", (currPage - 1) * pageSize);
        mapp.put("pageSize", pageSize);

        List<Map<String, Object>> reGetDoctorsItems = doctorinfoService.queryByCondition(mapp);
        mapp = new HashMap<>();
        mapp.put("confirmstate", "1");
        mapp.put("websitestate", "1");
        mapp.put("orderby", "maintable.websiteranking desc");
        List<Map<String, Object>> resum = doctorinfoMapper.getDoctorinf(mapp);

        for (int i = 0; i < reGetDoctorsItems.size(); i++) {
            Map<String, Object> mapskill;
            List<Map<String, Object>> list;
            Map map1 = reGetDoctorsItems.get(i);
            if (map1.get("duties") != null && StringUtils.isNotBlank(map1.get("duties").toString().trim())) {
                map1.put("duties", getDatadictionarydetail("zhicheng", map1.get("duties").toString()));
            }
            //整合擅长技能
            mapskill = new HashMap<>();
            mapskill.put("doctorid", map1.get("id"));
            list = doctorinfoMapper.getDoctorSkillName(mapskill);
            if (list.size() > 0) {
                map1.put("skillname", list.get(0).get("skillname"));
            }
        }
        Map map = new HashMap();
        map.put("reGetDoctorsItems", reGetDoctorsItems);
        //一共多少页
        map.put("pageye", resum.size() % 10 == 0 ? (resum.size() / 10) : (resum.size() / 10) + 1);
        //当前第几页
        map.put("page", currPage);
        //一共多少记录
        map.put("pagecount", resum.size());

        modelAndView.setViewName("list");
        modelAndView.addObject("remap", map);
        modelAndView.addObject("url", url);
        return modelAndView;
    }
    @RequestMapping(value = "/jump/{cc}.html")
    public Object resu(@PathVariable String  cc) throws Exception {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName(cc);
        modelAndView.addObject("url", url);
        return modelAndView;
    }

    //查询职称
    public String getDatadictionarydetail(String sortcode, String itemcode) {
        String itemname = null;
        Map<String, Object> map = new HashMap<>();
        map.put("sortcode", sortcode);
        map.put("itemcode", itemcode);
        try {
            itemname = doctorinfoMapper.getDuties(map);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return itemname;
    }

    /**
     * 文章查询
     */
    @RequestMapping(value = "/article")
    public Object queryArticle( String type,  String classify,String orders){
        Map map = new HashMap();
        map.put("type",type);
        map.put("classify",classify);
        if("quan".equals(orders)){
            map.put("desc","desc");
        }else if("lie".equals(orders)){
            map.put("wdesc","wdesc");
        }
        ModelAndView modelAndView = new ModelAndView();
        List<Map<String,Object>> list = doctorinfoMapper.queryArticle(map);
        for(int i =0;i<list.size();i++){
            try {
                Map jmap = list.get(i);
                DateFormat df_parseDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                Date update = (Date) df_parseDate.parse(jmap.get("updatetime")+"");
                //System.out.println((new Date().getTime()-update.getTime()));

                //int retime =  Integer.valueOf(String.valueOf((new Date().getTime()-update.getTime())))/(1000*60);
                long retime =  (new Date().getTime()-update.getTime())/(60*1000);
                int hous = (int)retime/60;
                if(hous > 1 && hous<23){
                    jmap.put("shijian",hous+"小时");
                }else if(hous>24){
                    SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
                    jmap.put("shijian",formatter.format(jmap.get("updatetime")));
                } else{
                    jmap.put("shijian",retime+"分钟");
                }
                String updatetime = df_parseDate.format(jmap.get("updatetime"));
                jmap.put("updatetime",updatetime);
                String creatime = df_parseDate.format(jmap.get("creatime"));
                jmap.put("creatime",creatime);
            } catch (ParseException e) {
                e.printStackTrace();
            }
        }
//        modelAndView.setViewName("list");
//        modelAndView.addObject("remap", list);
//        modelAndView.addObject("url", url);
        //System.out.println(list);
        return list;
    }

    /**
     * 文章详情
     */
    @RequestMapping(value = "/details")
    public Object getArticleDetails(String id){
        Map map = new HashMap();
        map.put("id",id);
        ModelAndView modelAndView = new ModelAndView();
        List<Map<String,Object>> list = doctorinfoMapper.queryArticle(map);
        DateFormat df_parseDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Map jmap = list.get(0);
        String updatetime = df_parseDate.format(jmap.get("updatetime"));
        jmap.put("updatetime",updatetime);
        String creatime = df_parseDate.format(jmap.get("creatime"));
        jmap.put("creatime",creatime);
//        modelAndView.setViewName("list");
        modelAndView.addObject("remap", list);
//        modelAndView.addObject("url", url);
        return list;
    }
}
