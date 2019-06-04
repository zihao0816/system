/**
 * Created by lifei on 2019/1/9.
 * 门诊信息
 */
import request from '@/api/request'

class OutpatientService {

  //列出指定待就诊列表
  findDiagnosisWaitList(doctorid) {
    return request({
      url:`/api/diagnosisqueue/wait?doctorid=${doctorid}`,
      method:'get'
    });
  }

  //列出已经就诊列表
  findDiagnosisAlreadyList(doctorid) {
    return request({
      url:`/api/diagnosisqueue/already?doctorid=${doctorid}`,
      method:'get'
    });
  }

  //查找指定已经就诊患者的列表
  findAlreadyPatientList(doctorid,patientid) {
    return request({
      url:`api/DiagnosisPlan/matchPatient?doctorid=${doctorid}&patientid=${patientid}`,
      method:'get'
    });
  }

}

export default  new OutpatientService();
