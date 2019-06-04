/**
 * Created by lifei on 2019/1/5.
 * 处方相关的服务
 */
import {doRequest} from '@/api/http'
import request from '@/api/request'

class PrescriptionService {

    //查找所有的药房列表
    findPharmacylist() {
      return request({
        url:'/api/hospitainfo/getHLists',
        method:'get'
      });
    }
    //查找剂型
    findBrand() {
      return request({
        url:'/api/Inquiry/getbrand',
        method:'get'
      });
    }
    //获取所有的药材
    listAllDrug(hospitalId,formulationId, brandId) {
      return request({
        url: `/api/DiagnosisPlan/drugs?hospitalId=${hospitalId}&formulationId=${formulationId}&brandId=${brandId}`,
        method:'get'
      });
    }
    //获取最终价格
  submitprescribejg(prescription) { 
      return request({
          url:'/api/DiagnosisPlan/prescribejg',
          data:prescription,
          method:'post'
      });
    }
    //提交处方单子
    submitPrescribe (prescription) {
      return request({
        url:'/api/DiagnosisPlan/prescribe',
        data:prescription,
        method:'post'
      });
    }
    //获取患者的就诊数量
    getPatientHistoryCount(doctorId, patientId)  {
      return request({
        url: `/api/DiagnosisPlan/getsum?doctorid=${doctorId}&patientid=${patientId}`,
        method:'get'
      });
    }
}

export default  new PrescriptionService();

